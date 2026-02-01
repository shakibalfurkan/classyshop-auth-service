import { redis } from "../../config/redis.js";
import { BadRequestError } from "../../errors/AppError.js";

const checkOtpRestrictions = async (email: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase().trim();

  const isBlocked = await redis.get(`otp_block:${normalizedEmail}`);
  if (isBlocked) {
    throw new BadRequestError(
      "Account temporarily blocked due to multiple failed OTP attempts. Please try again after 30 minutes.",
      "OTP_BLOCKED",
    );
  }

  const isSpamBlocked = await redis.get(`otp_spam_block:${normalizedEmail}`);
  if (isSpamBlocked) {
    throw new BadRequestError(
      "Too many OTP requests. Please try again after 60 minutes.",
      "OTP_SPAM_BLOCKED",
    );
  }

  const isInCooldown = await redis.get(`otp_cooldown:${normalizedEmail}`);
  if (isInCooldown) {
    throw new BadRequestError(
      "Please wait 1 minute before requesting a new OTP.",
      "OTP_COOLDOWN",
    );
  }

  return true;
};

export default checkOtpRestrictions;
