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
import { setCookie } from "../../utils/cookieHandler.js";
import Seller from "../seller/seller.model.js";
import Shop from "../shop/shop.model.js";
import { Stripe } from "stripe";

export const stripe = new Stripe(config.stripe_secret_key!, {
  apiVersion: "2025-12-15.clover",
});

const registerUserInToDB = async (payload: TRegisterPayload) => {
  const { name, email } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(400, "User already exists with this email!");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);
  await sendOtp(name as string, email, "email_verification");

  return null;
};

const verifyUser = async (payload: TUserVerificationPayload) => {
  const { name, email, password, otp } = payload;

  if (!name || !email || !password || !otp) {
    throw new AppError(400, "All fields are required!");
  }

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

  const userAccessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  const userRefreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string
  );

  const { password, ...userData } = user.toObject();

  setCookie(res, "userAccessToken", userAccessToken);
  setCookie(res, "userRefreshToken", userRefreshToken);

  return { user: userData };
};

const forgotUserPassword = async (email: string) => {
  if (!email) {
    throw new AppError(400, "Please provide email");
  }

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

  const user = await User.findOne({ email: decodedToken.email }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(400, "User already exists with this email!");
  }

  const isSamePassword = await isPasswordMatched(newPassword, user.password!);

  if (isSamePassword) {
    throw new AppError(400, "New password cannot be same as old password");
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
    throw new AppError(400, "New password cannot be same as old password");
  }

  const newHashedPassword = await hashPassword(
    newPassword,
    config.bcrypt_salt_round!
  );

  await User.findOneAndUpdate({ email }, { password: newHashedPassword });

  return null;
};

// common services
const tokenCheck = async (token: string) => {
  if (!token) {
    throw new AppError(401, "Session expired!");
  }

  const verifyToken = jwtHelper.verifyToken(
    token,
    config.jwt_reset_token_secret!
  ) as JwtPayload;

  if (!verifyToken) {
    throw new AppError(401, "Session expired!");
  }

  return null;
};

const refreshToken = async (token: string, res: Response) => {
  const decodedToken = jwtHelper.verifyToken(
    token,
    config.jwt_refresh_token_secret!
  ) as JwtPayload;

  console.log({ decodedToken });

  if (
    !decodedToken ||
    !decodedToken.id ||
    !decodedToken.email ||
    !decodedToken.role
  ) {
    throw new AppError(401, "You are not authorized!");
  }

  const user =
    decodedToken?.role === USER_ROLES.USER
      ? await User.findOne({ email: decodedToken.email })
      : await Seller.findOne({ email: decodedToken.email });

  if (!user) {
    throw new AppError(401, "You are not authorized!");
  }

  const newAccessToken = jwtHelper.createToken(
    {
      id: user._id.toString(),
      email: user.email,
      role: decodedToken.role,
    },
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  );

  const tokenName =
    decodedToken.role === USER_ROLES.USER
      ? "userAccessToken"
      : decodedToken.role === USER_ROLES.SELLER
      ? "sellerAccessToken"
      : "adminAccessToken";

  setCookie(res, tokenName, newAccessToken);

  return { accessToken: newAccessToken };
};

const getMeFromDB = async (email: string, role: string) => {
  const user =
    role === USER_ROLES.USER
      ? await User.findOne({ email })
      : role === USER_ROLES.SELLER
      ? await Seller.findOne({ email })
      : null;
  if (!user) {
    throw new AppError(400, "User does not exist!");
  }
  return user;
};

const logout = async (res: Response) => {
  const cookiesToClear = [
    "userAccessToken",
    "userRefreshToken",
    "adminAccessToken",
    "adminRefreshToken",
    "sellerAccessToken",
    "sellerRefreshToken",
  ];

  cookiesToClear.forEach((cookie) => {
    res.clearCookie(cookie);
  });

  return null;
};

// seller routes
const registerSellerInDB = async (name: string, email: string) => {
  const isSellerExist = await Seller.findOne({ email });

  if (isSellerExist) {
    throw new AppError(400, "Seller already exists with this email!");
  }

  await checkOtpRestrictions(email);
  await trackOtpRequests(email);
  await sendOtp(name, email, "email_verification");
  return null;
};
const verifySeller = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  otp: string;
}) => {
  const { name, email, phoneNumber, country, password, otp } = payload;

  if (!name || !email || !phoneNumber || !country || !password || !otp) {
    throw new AppError(400, "All fields are required!");
  }

  const isExistingSeller = await Seller.findOne({ email });

  if (isExistingSeller) {
    throw new AppError(400, "Seller already exists with this email!");
  }

  await verifyOtp(email, otp);

  await Seller.create({
    name,
    email,
    phoneNumber,
    country,
    password,
  });

  return null;
};

const loginSeller = async (payload: TLoginPayload, res: Response) => {
  const { email, password: plainPassword } = payload;

  const seller = await Seller.findOne({ email }).select("+password");

  if (!seller) {
    throw new AppError(400, "Seller does not exist!");
  }

  const passwordMatch = await isPasswordMatched(
    plainPassword,
    seller?.password as string
  );

  if (!passwordMatch) {
    throw new AppError(400, "Invalid credentials!");
  }

  const jwtPayload = {
    id: seller._id.toString(),
    email: seller.email,
    role: USER_ROLES.SELLER,
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

  setCookie(res, "sellerAccessToken", accessToken);
  setCookie(res, "sellerRefreshToken", refreshToken);

  const { password, ...sellerData } = seller.toObject();

  return { seller: sellerData };
};

// create shop
const createShopIntoDB = async (payload: {
  name: string;
  bio: string;
  address: string;
  openingHours: string;
  website: string;
  category: string;
  sellerId: string;
}) => {
  const { name, bio, address, openingHours, website, category, sellerId } =
    payload;
  if (!name || !bio || !address || !openingHours || !category || !sellerId) {
    throw new AppError(400, "All fields are required!");
  }

  const shopData: any = {
    name,
    bio,
    address,
    openingHours,
    category,
    sellerId,
  };

  if (website && website.trim() !== "") {
    shopData.website = website;
  }

  const shop = await Shop.create(shopData);

  return shop;
};

const createStripeConnectionLink = async (sellerId: string) => {
  if (!sellerId) {
    throw new AppError(
      400,
      "Seller ID is required to create Stripe connection link"
    );
  }

  const seller = await Seller.findById(sellerId);

  if (!seller) {
    throw new AppError(404, "Seller not found");
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: seller.country || "US",
    email: seller.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  seller.stripeAccountId = account.id;
  await seller.save();

  const accountLink = await stripe.accountLinks.create({
    account: seller.stripeAccountId,
    refresh_url: `${process.env.CLIENT_URL}/stripe-refresh`,
    return_url: `${process.env.CLIENT_URL}/stripe-success`,
    type: "account_onboarding",
  });

  return accountLink.url;
};

export const AuthService = {
  registerUserInToDB,
  verifyUser,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  changeUserPassword,

  tokenCheck,
  refreshToken,
  getMeFromDB,
  logout,

  registerSellerInDB,
  verifySeller,
  loginSeller,

  createShopIntoDB,
  createStripeConnectionLink,
};
