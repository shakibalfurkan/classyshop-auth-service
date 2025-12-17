import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

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
  const { id, newPassword, token } = req.body;

  const result = await AuthService.resetUserPassword(id, newPassword, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully.",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  verifyUser,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
};
