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

export const AuthController = {
  registerUser,
  verifyUser,
};
