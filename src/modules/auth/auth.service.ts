import crypto from "crypto";
import config from "../../config/index.js";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import type { TRegisterRequest } from "../../types/auth.types.js";
import {
  hashPassword,
  isPasswordMatched,
} from "../../utils/passwordHandler.js";
import { redisClient } from "../../config/redis.js";
import { EventBus } from "../../events/event-bus.js";
import {
  KafkaTopics,
  NotificationEventTypes,
} from "../../events/event-types.js";
import verifyOtp from "../../utils/otp/verifyOtp.js";
import logger from "../../utils/logger.js";
import checkOtpRestrictions from "../../utils/otp/checkOtpRestrictions.js";
import trackOtpRequests from "../../utils/otp/trackOtpRequests.js";
import { UserRoles } from "../../generated/prisma/enums.js";
import createInternalSignature from "../../utils/createInternalSignature.js";
import type {
  ILoginResult,
  IRegistrationResult,
  ITokenRefreshResult,
} from "./auth.interface.js";
import { createUserProfile } from "../../lib/axiosClients/userServiceClient.js";
import { buildJwtPayload } from "../../utils/token/buildJwtPayload.js";
import {
  issueAccessToken,
  issueRefreshToken,
} from "../../utils/token/issueToken.js";
import {
  checkLockout,
  handleFailedLogin,
  resetLoginAttempts,
} from "../../utils/handleLogin.js";
import {
  revokeRefreshToken,
  revokeTokenFamily,
} from "../../utils/token/revokeToken.js";
import { generateToken } from "../../utils/token/generateToken.js";

const registerRequest = async (payload: TRegisterRequest) => {
  const { email, password, role, firstName, lastName, shopData } = payload;

  const existingUser = await prisma.credential.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new BadRequestError("Email already in use", "email");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  const hashedPassword = await hashPassword(password, config.bcrypt_salt_round);

  const otp = crypto.randomInt(100000, 999999).toString();

  const registrationData: TRegisterRequest = {
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
  };
  if (role === UserRoles.SELLER && shopData) {
    registrationData.shopData = shopData;
  }

  await redisClient.setex(
    `auth:reg:${email}`,
    35 * 60,
    JSON.stringify(registrationData),
  );
  await redisClient.setex(`auth:otp:${email}`, 5 * 60, otp);

  await EventBus.publish(KafkaTopics.NOTIFICATIONS, {
    eventType: NotificationEventTypes.AUTH_OTP,
    source: config.serviceName,
    payload: {
      reason: "email-verification",
      name: firstName,
      email,
      otp,
    },
  });
  return null;
};

const verifyRegistration = async (
  requestId: string,
  payload: { email: string; otp: string },
) => {
  const { email, otp } = payload;

  const cachedData = await redisClient.get(`auth:reg:${email}`);
  if (!cachedData) {
    throw new BadRequestError("Registration expired or not found");
  }

  const { password, ...userData } = JSON.parse(cachedData);

  await verifyOtp(email, otp);

  const credential = await prisma.credential.create({
    data: {
      email: userData.email,
      password,
      role: userData.role,
    },
  });

  const requestBody = {
    id: credential.id,
    ...userData,
  };

  const signature = createInternalSignature(
    requestBody,
    config.internal_service_secret,
  );

  try {
    await createUserProfile(requestBody, signature, requestId);
  } catch (error) {
    await prisma.credential.delete({ where: { id: credential.id } });

    logger.error(`[AuthService] Registration failed`, { requestId, error });
    throw new InternalServerError(
      "User registration failed. Please try again.",
    );
  }

  await redisClient
    .del(`auth:reg:${email}`)
    .catch((err: any) =>
      logger.error(
        `[redisClient] Failed to delete registration cache for ${email}`,
        err,
      ),
    );

  const jwtPayload = buildJwtPayload(credential);

  const accessToken = issueAccessToken(jwtPayload);
  const { token: refreshToken } = await issueRefreshToken(
    jwtPayload,
    credential.id,
  );

  const result: IRegistrationResult = {
    user: {
      id: credential.id,
      email: credential.email,
      role: credential.role,
    },
    accessToken,
    refreshToken,
  };

  await EventBus.publish(KafkaTopics.NOTIFICATIONS, {
    eventType: NotificationEventTypes.AUTH_REGISTERED,
    source: config.serviceName,
    payload: {
      name: userData.firstName,
      email,
    },
  });

  return result;
};

const resendOtp = async (email: string) => {
  const cachedData = await redisClient.get(`auth:reg:${email}`);
  if (!cachedData) {
    throw new BadRequestError("Registration expired or not found");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  const otp = crypto.randomInt(100000, 999999).toString();
  await redisClient.setex(`auth:otp:${email}`, 5 * 60, otp);

  const { firstName } = JSON.parse(cachedData);

  await EventBus.publish(KafkaTopics.NOTIFICATIONS, {
    eventType: NotificationEventTypes.AUTH_OTP,
    source: config.serviceName,
    payload: {
      reason: "email-verification",
      firstName,
      email,
      otp,
    },
  });

  return null;
};

const login = async (payload: {
  email: string;
  password: string;
}): Promise<ILoginResult> => {
  const { email, password } = payload;

  const credential = await prisma.credential.findUnique({
    where: { email },
  });

  if (!credential) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!credential.isActive) {
    throw new UnauthorizedError("Account is deactivated");
  }

  checkLockout(credential);

  const isPasswordValid = await isPasswordMatched(
    password,
    credential.password,
  );
  if (!isPasswordValid) {
    await handleFailedLogin(credential.id);
    throw new UnauthorizedError("Invalid email or password");
  }

  await resetLoginAttempts(credential.id);

  const jwtPayload = buildJwtPayload(credential);

  const accessToken = issueAccessToken(jwtPayload);
  const { token: refreshToken } = await issueRefreshToken(
    jwtPayload,
    credential.id,
  );

  return {
    user: {
      id: credential.id,
      email: credential.email,
      role: credential.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<ITokenRefreshResult> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { credential: true },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (storedToken.isRevoked) {
    await revokeTokenFamily(storedToken.familyId);
    logger.warn(
      `[RTR] Token reuse detected — revoked family ${storedToken.familyId} for credential ${storedToken.credentialId}`,
    );
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  if (storedToken.expiresAt < new Date()) {
    await revokeRefreshToken(token);
    throw new UnauthorizedError("Refresh token has expired");
  }

  await revokeRefreshToken(token);

  const jwtPayload = buildJwtPayload(storedToken.credential);
  const accessToken = issueAccessToken(jwtPayload);
  const { token: newRefreshToken } = await issueRefreshToken(
    jwtPayload,
    storedToken.credentialId,
    storedToken.familyId,
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
    role: storedToken.credential.role,
  };
};

const logout = async (token: string): Promise<void> => {
  await revokeRefreshToken(token);
};

const requestPasswordReset = async (email: string): Promise<void> => {
  const credential = await prisma.credential.findUnique({
    where: { email },
  });

  if (!credential) {
    return;
  }

  const resetToken = generateToken(
    {
      id: credential.id,
      role: credential.role,
      email: credential.email,
      tokenType: "reset",
    },
    config.jwt.reset_token_secret,
    config.jwt.reset_token_expires_in,
  );

  await prisma.passwordReset.create({
    data: {
      credentialId: credential.id,
      resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await EventBus.publish(KafkaTopics.NOTIFICATIONS, {
    eventType: NotificationEventTypes.AUTH_PASSWORD_RESET,
    source: config.serviceName,
    payload: {
      email,
      resetToken,
    },
  });
};

const verifyPasswordReset = async (payload: {
  resetToken: string;
  newPassword: string;
}): Promise<void> => {
  const { resetToken, newPassword } = payload;

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { resetToken },
  });

  if (!resetRecord) {
    throw new BadRequestError("Invalid or expired reset token");
  }

  if (resetRecord.usedAt) {
    throw new BadRequestError("Reset token has already been used");
  }

  if (resetRecord.expiresAt < new Date()) {
    throw new BadRequestError("Reset token has expired");
  }

  const hashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round,
  );

  await prisma.$transaction([
    prisma.credential.update({
      where: { id: resetRecord.credentialId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);
};

export const AuthService = {
  registerRequest,
  verifyRegistration,
  resendOtp,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  verifyPasswordReset,
};
