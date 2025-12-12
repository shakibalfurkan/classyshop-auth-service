import AppError from "../../errors/AppError.js";
import User from "../user/user.model.js";
import type {
  TRegisterPayload,
  TUserVerificationPayload,
} from "./auth.interface.js";
import checkOtpRestrictions from "../../utils/checkOtpRestrictions.js";
import trackOtpRequests from "../../utils/trackOtpRequests.js";
import sendOtp from "../../utils/sendOtp.js";
import verifyOtp from "../../utils/verifyOtp.js";

const registerUserInToDB = async (payload: TRegisterPayload) => {
  const { name, email } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(400, "User already exists with this email!");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);
  await sendOtp(name as string, email, "user_email_verification");

  return null;
};

const verifyUser = async (payload: TUserVerificationPayload) => {
  const { name, email, password, otp } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(400, "User already exists with this email!");
  }

  await verifyOtp(email, otp);

  await User.create({
    name,
    email,
    password,
  });

  return null;
};

export const AuthService = {
  registerUserInToDB,
  verifyUser,
};
