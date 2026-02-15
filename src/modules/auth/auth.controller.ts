import type { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

const registerRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerRequest(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent to your email",
    data: result,
  });
});

export const AuthController = {
  registerRequest,
};
