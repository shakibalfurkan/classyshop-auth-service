import crypto from "crypto";
import { redis } from "../database/redis.js";
import { sendEmail } from "./sendMail.js";

const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  await sendEmail(email, "Your One Time Password (OTP)", template, {
    name,
    otp,
  });

  await redis.set(`otp:${email}`, otp, "EX", 5 * 60);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 2 * 60);
};

export default sendOtp;
