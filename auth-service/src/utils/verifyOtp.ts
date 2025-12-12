import { redis } from "../database/redis.js";
import AppError from "../errors/AppError.js";

const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}` || "");

  if (!storedOtp) {
    throw new AppError(400, "Expired OTP");
  }

  const failedAttemptKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptKey)) || "0");

  if (otp !== storedOtp) {
    if (failedAttempts >= 3) {
      await redis.set(`otp_block:${email}`, "blocked", "EX", 15 * 60);
      await redis.del(`otp:${email}`, failedAttemptKey);
      throw new AppError(
        400,
        "Account blocked due to multiple failed OTP attempts. Please try again after 15 minutes."
      );
    }
    await redis.set(
      failedAttemptKey,
      (failedAttempts + 1).toString(),
      "EX",
      15 * 60
    );
    throw new AppError(
      400,
      `Invalid OTP. ${3 - failedAttempts} attempts left.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptKey);
};

export default verifyOtp;
