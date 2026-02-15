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

export const verifyRegistration = async (payload: {
  email: string;
  otp: string;
}) => {
  const { email, otp } = payload;

  const cachedData = await redis.get(`reg:${email}`);
  if (!cachedData) {
    throw new BadRequestError("Registration expired or not found");
  }

  const data = JSON.parse(cachedData);

  await verifyOtp(email, otp);

  const credential = await prisma.credential.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });

  try {
    data.delete("password");

    const requestBody = {
      id: credential.id,
      role: data.role,
      ...data,
    };

    const signature = createInternalSignature(
      requestBody,
      config.internal_service_secret!,
    );

    await axios.post(
      `${config.user_service_url}/internal/create-profile`,
      requestBody,
      {
        headers: {
          "X-Internal-Signature": signature,
          "X-Internal-Timestamp": Date.now().toString(),
        },
      },
    );
  } catch (error) {
    logger.error(
      `[AuthService] Failed to create profile in UserService for userId: ${credential.id}`,
      error,
    );

    try {
      await prisma.credential.delete({ where: { id: credential.id } });
      logger.info(
        `[AuthService] Successfully rolled back credential for userId: ${credential.id}`,
      );
    } catch (rollbackError) {
      logger.error(
        `[CRITICAL] Failed to rollback credential for userId: ${credential.id}`,
        rollbackError,
      );
    }

    throw new InternalServerError(
      "User registration failed during profile creation. Please try again.",
    );
  }

  await redis
    .del(`reg:${email}`)
    .catch((err: any) =>
      console.error(
        `[Redis] Failed to delete registration cache for ${email}`,
        err,
      ),
    );

  // const token = generateToken(credential);

  // return { token, user: credential };
};

export const AuthService = {
  registerRequest,
};
