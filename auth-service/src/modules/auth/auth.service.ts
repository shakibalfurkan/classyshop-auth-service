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
import { createToken, jwtHelper } from "../../utils/jwtHelper/index.js";
import config from "../../config/index.js";
import { USER_ROLES } from "../../constant/index.js";
import { sendEmail } from "../../utils/sendMail.js";
import type { JwtPayload } from "jsonwebtoken";

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
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "User does not exist!");
  }

  const jwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: USER_ROLES.USER,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_reset_token_secret as string,
    config.jwt_reset_token_expires_in as string
  );

  const resetUILink = `${config.user_client_url}/token-check?token=${resetToken}`;

  sendEmail(user.email, "Forgot Password", "forgot_password", {
    name: user.name,
    resetUILink,
  });

  return null;
};

const resetUserPassword = async (newPassword: string, token: string) => {
  const decodedToken = jwtHelper.verifyToken(
    token,
    config.jwt_reset_token_secret!
  ) as JwtPayload;

  if (!decodedToken) {
    throw new AppError(401, "You are not authorized!");
  }

  const user = await User.findOne({ email: decodedToken.email });

  if (!user) {
    throw new AppError(400, "User already exists with this email!");
  }

  const isSamePassword = await isPasswordMatched(newPassword, user.password!);

  if (isSamePassword) {
    throw new AppError(400, "Please provide new password");
  }

  const newHashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round!
  );

  await User.findOneAndUpdate(
    { email: user.email },
    { password: newHashedPassword }
  );

  return null;
};

const changeUserPassword = async (
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
    throw new AppError(400, "Please provide new password");
  }

  const newHashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round!
  );

  await User.findOneAndUpdate({ email }, { password: newHashedPassword });

  return null;
};

const tokenCheck = async (token: string) => {
  const verifyToken = jwtHelper.verifyToken(
    token,
    config.jwt_reset_token_secret!
  ) as JwtPayload;

  if (!verifyToken) {
    throw new AppError(401, "Session expired!");
  }

  return null;
};

export const AuthService = {
  registerUserInToDB,
  verifyUser,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  changeUserPassword,
  tokenCheck,
};
