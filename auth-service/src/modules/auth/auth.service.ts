import type { Response } from "express";
import AppError from "../../errors/AppError.js";
import User from "../user/user.model.js";
import type {
  TLoginPayload,
  TRegisterPayload,
  TUserVerificationPayload,
} from "./auth.interface.js";
import checkOtpRestrictions from "../../utils/checkOtpRestrictions.js";
import trackOtpRequests from "../../utils/trackOtpRequests.js";
import sendOtp from "../../utils/sendOtp.js";
import verifyOtp from "../../utils/verifyOtp.js";
import {
  hashPassword,
  isPasswordMatched,
} from "../../utils/passwordManager.js";
import { createToken } from "../../utils/jwtHelper/index.js";
import config from "../../config/index.js";
import handleForgotPassword from "../../utils/handleForgotPassword.js";
import { USER_ROLES } from "../../constant/index.js";

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
  console.log(payload);

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

const loginUser = async (payload: TLoginPayload, res: Response) => {
  const { email, password: plainPassword } = payload;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError(400, "User does not exist!");
  }

  const passwordMatch = await isPasswordMatched(
    plainPassword,
    user?.password as string
  );

  if (!passwordMatch) {
    throw new AppError(400, "Invalid credentials!");
  }

  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: USER_ROLES.USER,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string
  );

  const { password, ...userData } = user.toObject();

  return { user: userData, token: { accessToken, refreshToken } };
};

const forgotUserPassword = async (email: string) => {
  await handleForgotPassword(email, USER_ROLES.USER);

  return null;
};

const verifyUserForgotPassword = async (
  email: string,
  newPassword: string,
  otp: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "User already exists with this email!");
  }

  const isSamePassword = await isPasswordMatched(newPassword, user.password!);

  if (isSamePassword) {
    throw new AppError(400, "Please provide different password");
  }

  await verifyOtp(email, otp);

  const newHashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round!
  );

  await User.findOneAndUpdate({ email }, { password: newHashedPassword });

  return null;
};

const resetUserPassword = async (
  email: string,
  newPassword: string,
  decodedEmail: string
) => {
  if (!email || !newPassword) {
    throw new AppError(400, "Please provide email and new password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "User does not exist!");
  }

  if (decodedEmail !== user.email) {
    throw new AppError(401, "You are not authorized!");
  }

  const isSamePassword = await isPasswordMatched(
    newPassword,
    user.password as string
  );

  if (isSamePassword) {
    throw new AppError(400, "Please provide different password");
  }

  const newHashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round!
  );

  await User.findOneAndUpdate({ email }, { password: newHashedPassword });

  return null;
};

export const AuthService = {
  registerUserInToDB,
  verifyUser,
  loginUser,
  forgotUserPassword,
  verifyUserForgotPassword,
  resetUserPassword,
};
