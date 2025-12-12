import { redis } from "../database/redis.js";
import AppError from "../errors/AppError.js";

const trackOtpRequests = async (email: string) => {
  const otpRequestsKey = `otp_request_count:${email}`;

  // If already spam-blocked, throw early
  if (await redis.get(`otp_spam_block:${email}`)) {
    throw new AppError(
      400,
      "Too many OTP requests. Please try again after 15 minutes."
    );
  }

  let otpRequests = parseInt((await redis.get(otpRequestsKey)) || "0");
  otpRequests += 1;

  // If this is the 3rd request, set spam block so further requests are blocked
  if (otpRequests >= 3) {
    // block further requests for 30 minutes
    await redis.set(`otp_spam_block:${email}`, "blocked", "EX", 30 * 60);
  }

  // store/update counter with 15-minute window
  await redis.set(otpRequestsKey, otpRequests.toString(), "EX", 15 * 60);

  return true;
};

export default trackOtpRequests;
