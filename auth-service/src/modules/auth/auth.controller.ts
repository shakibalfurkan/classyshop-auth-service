import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

// user controllers
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUserInToDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP sent to the email. Please verify to complete registration.",
    data: result,
  });
});

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User registered successfully.",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully.",
    data: result,
  });
});

const forgotUserPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotUserPassword(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reset password link sent to your email.",
    data: result,
  });
});

const resetUserPassword = catchAsync(async (req: Request, res: Response) => {
  const { newPassword, token } = req.body;

  const result = await AuthService.resetUserPassword(newPassword, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully.",
    data: result,
  });
});

const changeUserPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const decodedEmail = req.user?.email;

  const result = await AuthService.changeUserPassword(
    email,
    newPassword,
    decodedEmail!
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully.",
    data: result,
  });
});

// common controllers
const tokenCheck = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  const result = await AuthService.tokenCheck(token as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token verified.",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token =
    req.cookies.userRefreshToken ||
    req.cookies.sellerRefreshToken ||
    req.cookies.adminRefreshToken;

  const result = await AuthService.refreshToken(token, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully.",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const email = req.user?.email;
  const role = req.user?.role;

  const result = await AuthService.getMeFromDB(email!, role!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully.",
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.logout(res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully.",
    data: result,
  });
});

const registerSeller = catchAsync(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const result = await AuthService.registerSellerInDB(name, email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent to the email. Please verify to complete registration.",
    data: result,
  });
});

const verifySeller = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifySeller(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seller registered successfully.",
    data: result,
  });
});

const loginSeller = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginSeller(req.body, res);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Seller logged in successfully.",
    data: result,
  });
});

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createShopIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Shop created successfully.",
    data: result,
  });
});

const createStripeConnectionLink = catchAsync(
  async (req: Request, res: Response) => {
    const sellerId = req.user?.id;
    const result = await AuthService.createStripeConnectionLink(sellerId!);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Stripe connection link created successfully.",
      data: result,
    });
  }
);

export const AuthController = {
  registerUser,
  verifyUser,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  changeUserPassword,

  tokenCheck,
  refreshToken,
  getMe,
  logout,

  registerSeller,
  verifySeller,
  loginSeller,

  createShop,
  createStripeConnectionLink,
};
