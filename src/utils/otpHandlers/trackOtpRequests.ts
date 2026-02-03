import { redis } from "../../config/redis.js";
import { BadRequestError } from "../../errors/AppError.js";

const OTP_REQUEST_LIMIT = 3;
const OTP_SPAM_BLOCK_DURATION = 60 * 60;
const OTP_REQUEST_WINDOW = 30 * 60;
const OTP_COOLDOWN_DURATION = 60;

const trackOtpRequests = async (email: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase().trim();
  const otpRequestCountKey = `otp_request_count:${normalizedEmail}`;
  const otpSpamBlockKey = `otp_spam_block:${normalizedEmail}`;
  const otpCooldownKey = `otp_cooldown:${normalizedEmail}`;

  const isSpamBlocked = await redis.get(otpSpamBlockKey);
  if (isSpamBlocked) {
    throw new BadRequestError(
      "Too many OTP requests. Please try again after 60 minutes.",
    );
  }

  const currentCount = await redis.get(otpRequestCountKey);
  const otpRequests = parseInt(currentCount || "0") + 1;

  if (otpRequests > OTP_REQUEST_LIMIT) {
    await redis.set(otpSpamBlockKey, "blocked", "EX", OTP_SPAM_BLOCK_DURATION);
    throw new BadRequestError(
      "Too many OTP requests. Please try again after 60 minutes.",
    );
  }

  await Promise.all([
    redis.set(
      otpRequestCountKey,
      otpRequests.toString(),
      "EX",
      OTP_REQUEST_WINDOW,
    ),
    redis.set(otpCooldownKey, "active", "EX", OTP_COOLDOWN_DURATION),
  ]);

  return true;
};

export default trackOtpRequests;
