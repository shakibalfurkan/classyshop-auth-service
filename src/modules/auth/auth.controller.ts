import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { setCookie } from "../../utils/cookieHandler.js";
import { UserRoles } from "../../generated/prisma/enums.js";
import type { IRegistrationResult } from "./auth.interface.js";

const registerRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerRequest(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent to your email",
    data: result,
  });
});

const verifyRegistration = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const { accessToken, refreshToken, user } =
    (await AuthService.verifyRegistration({
      email,
      otp,
    })) as IRegistrationResult;

  if (user.role !== UserRoles.CUSTOMER) {
    setCookie(res, "accessToken", accessToken!, 60 * 60 * 1000);
    setCookie(res, "refreshToken", refreshToken!);
  }

  const result: IRegistrationResult = {
    user,
  };

  if (user.role === UserRoles.CUSTOMER) {
    result.accessToken = accessToken!;
    result.refreshToken = refreshToken!;
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result,
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.resendOtp(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP resent to your email",
    data: result,
  });
});

export const AuthController = {
  registerRequest,
  verifyRegistration,
  resendOtp,
};
