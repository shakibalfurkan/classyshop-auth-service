import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { setCookie, clearCookie } from "../../utils/cookieHandler.js";
import { UserRoles } from "../../generated/prisma/enums.js";
import type { IAuthResult, IRegisterRequestDTO } from "./auth.interface.js";

const registerRequest = catchAsync(async (req: Request, res: Response) => {
  const payload: IRegisterRequestDTO = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  };

  const result = await AuthService.registerRequest(payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent to your email",
    data: result,
  });
});

const verifyRegistration = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const requestId = req.requestId;
  const clientType = req.headers["X-Client-Type"];

  const { accessToken, refreshToken, ...credentialData } =
    await AuthService.verifyRegistration(requestId!, {
      email,
      otp,
    });

  const isCustomer = clientType === "customer-web";

  if (!isCustomer) {
    setCookie(res, "accessToken", accessToken!, 60 * 60 * 1000);
    setCookie(res, "refreshToken", refreshToken!, 7 * 24 * 60 * 60 * 1000);
  }

  const credentials: IAuthResult = {
    ...credentialData,
    ...(accessToken && isCustomer && { accessToken }),
    ...(refreshToken && isCustomer && { refreshToken }),
  };

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: credentials,
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

const login = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };

  const clientType = req.headers["X-Client-Type"];

  const { accessToken, refreshToken, ...credentialData } =
    await AuthService.login(payload);

  const isCustomer = clientType === "customer-web";

  if (!isCustomer) {
    setCookie(res, "accessToken", accessToken!, 60 * 60 * 1000);
    setCookie(res, "refreshToken", refreshToken!, 7 * 24 * 60 * 60 * 1000);
  }

  const credentials: IAuthResult = {
    ...credentialData,
    ...(accessToken && isCustomer && { accessToken }),
    ...(refreshToken && isCustomer && { refreshToken }),
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: credentials,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  const clientType = req.headers["X-Client-Type"];

  const result = await AuthService.refreshToken(token);

  const isCustomer = clientType === "customer-web";

  if (!isCustomer) {
    setCookie(res, "accessToken", result.accessToken!, 60 * 60 * 1000);
    setCookie(
      res,
      "refreshToken",
      result.refreshToken!,
      7 * 24 * 60 * 60 * 1000,
    );
  }

  const responseData = {
    ...(result.accessToken &&
      isCustomer && { accessToken: result.accessToken }),
    ...(result.refreshToken &&
      isCustomer && { refreshToken: result.refreshToken }),
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully",
    data: responseData,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  await AuthService.logout(token);

  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const clientType = req.headers["X-Client-Type"];

  await AuthService.requestPasswordReset(email, clientType as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
    data: null,
  });
});

const verifyPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  await AuthService.verifyPasswordReset({ resetToken, newPassword });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password has been reset successfully.",
    data: null,
  });
});

export const AuthController = {
  registerRequest,
  verifyRegistration,
  resendOtp,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  verifyPasswordReset,
};
