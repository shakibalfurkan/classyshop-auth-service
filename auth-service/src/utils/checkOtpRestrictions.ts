import { redis } from "../database/redis.js";
import AppError from "../errors/AppError.js";

const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_block:${email}`)) {
    throw new AppError(
      400,
      "Account blocked due to multiple failed OTP attempts. Please try again after 15 minutes."
    );
  }

  if (await redis.get(`otp_spam_block:${email}`)) {
    throw new AppError(
      400,
      "Too many OTP requests. Please try again after 15 minutes."
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new AppError(
      400,
      "Please wait for 2 minutes before requesting a new OTP."
    );
  }

  return true;
};

export default checkOtpRestrictions;
