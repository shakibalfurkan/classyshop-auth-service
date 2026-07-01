import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import { AuthValidation } from "./auth.validation.js";

const router: Router = Router();

router.post(
  "/register-request",
  rateLimiter({ maxRequests: 3, windowSeconds: 300 }),
  validateRequest(AuthValidation.registerRequestValidationSchema),
  AuthController.registerRequest,
);

router.post(
  "/verify-registration",
  validateRequest(AuthValidation.verifyRegistrationValidationSchema),
  AuthController.verifyRegistration,
);

router.post(
  "/resend-otp",
  rateLimiter({ maxRequests: 3, windowSeconds: 120 }),
  validateRequest(AuthValidation.resendOtpValidationSchema),
  AuthController.resendOtp,
);

router.post(
  "/login",
  rateLimiter({ maxRequests: 5, windowSeconds: 60 }),
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);

router.post(
  "/refresh",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refresh,
);

router.post(
  "/logout",
  validateRequest(AuthValidation.logoutValidationSchema),
  AuthController.logout,
);

router.post(
  "/forgot-password",
  rateLimiter({ maxRequests: 3, windowSeconds: 300 }),
  validateRequest(AuthValidation.requestPasswordResetValidationSchema),
  AuthController.requestPasswordReset,
);

router.post(
  "/reset-password",
  rateLimiter({ maxRequests: 3, windowSeconds: 300 }),
  validateRequest(AuthValidation.verifyPasswordResetValidationSchema),
  AuthController.verifyPasswordReset,
);

export const AuthRoutes = router;
