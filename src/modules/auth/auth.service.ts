import crypto from "crypto";
import config from "../../config/index.js";
import { BadRequestError, InternalServerError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import type { TRegisterRequest } from "../../types/auth.types.js";
import { hashPassword } from "../../utils/passwordHandler.js";
import { redis } from "../../config/redis.js";
import { EventBus } from "../../events/event-bus.js";
import {
  KafkaTopics,
  NotificationEventTypes,
} from "../../events/event-types.js";
import verifyOtp from "../../utils/otpHandlers/verifyOtp.js";
import axios from "axios";
import logger from "../../utils/logger.js";
import checkOtpRestrictions from "../../utils/otpHandlers/checkOtpRestrictions.js";
import trackOtpRequests from "../../utils/otpHandlers/trackOtpRequests.js";
import { UserRoles } from "../../generated/prisma/enums.js";
import createInternalSignature from "../../utils/createInternalSignature.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import { setCookie } from "../../utils/cookieHandler.js";
import type { IRegistrationResult } from "./auth.interface.js";

const registerRequest = async (payload: TRegisterRequest) => {
  const { email, password, role, firstName, lastName, shopData } = payload;

  const existingUser = await prisma.credential.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already in use", "email");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  const hashedPassword = await hashPassword(
    password,
    config.bcrypt_salt_round!,
  );

  const otp = crypto.randomInt(100000, 999999).toString();

  const registrationData: TRegisterRequest = {
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
  };
  if (role === UserRoles.VENDOR && shopData) {
    registrationData.shopData = shopData;
  }

  await redis.setex(`reg:${email}`, 35 * 60, JSON.stringify(registrationData));
  await redis.setex(`otp:${email}`, 5 * 60, otp);

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

const verifyRegistration = async (
  requestId: string,
  payload: { email: string; otp: string },
) => {
  const { email, otp } = payload;

  const cachedData = await redis.get(`reg:${email}`);
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
    config.internal_service_secret!,
  );

  try {
    await axios.post(
      `${config.user_service_url}/users/create-profile`,
      requestBody,
      {
        headers: {
          "X-Internal-Signature": signature,
          "X-Internal-Timestamp": Date.now().toString(),
          "X-Request-ID": requestId,
        },
      },
    );
  } catch (error) {
    await prisma.credential.delete({ where: { id: credential.id } });

    logger.error(`[AuthService] Registration failed`, { requestId, error });
    throw new InternalServerError(
      "User registration failed. Please try again.",
    );
  }

  await redis
    .del(`reg:${email}`)
    .catch((err: any) =>
      logger.error(
        `[Redis] Failed to delete registration cache for ${email}`,
        err,
      ),
    );

  const jwtPayload = {
    id: credential.id,
    role: credential.role,
    email: credential.email,
  };

  const accessToken = JwtHelpers.generateToken(
    { ...jwtPayload, tokenType: "access" },
    config.jwt.access_token_secret!,
    config.jwt.access_token_expires_in!,
  );

  const refreshToken = JwtHelpers.generateToken(
    { ...jwtPayload, tokenType: "refresh" },
    config.jwt.refresh_token_secret!,
    config.jwt.refresh_token_expires_in!,
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

  return result;
};

const resendOtp = async (email: string) => {
  const cachedData = await redis.get(`reg:${email}`);
  if (!cachedData) {
    throw new BadRequestError("Registration expired or not found");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  const otp = crypto.randomInt(100000, 999999).toString();
  await redis.setex(`otp:${email}`, 5 * 60, otp);

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

export const AuthService = {
  registerRequest,
  verifyRegistration,
  resendOtp,
};
