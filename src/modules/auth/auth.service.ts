import crypto from "crypto";
import config from "../../config/index.js";
import { BadRequestError } from "../../errors/AppError.js";
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

const registerRequest = async (payload: TRegisterRequest) => {
  const { email, password, role, firstName, lastName, ...shopData } = payload;

  const existingUser = await prisma.credential.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already in use", "email");
  }

  const hashedPassword = await hashPassword(
    password,
    config.bcrypt_salt_round!,
  );

  const otp = crypto.randomInt(100000, 999999).toString();

  const registrationData = {
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
    shopData,
  };

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

export const AuthService = {
  registerRequest,
};
