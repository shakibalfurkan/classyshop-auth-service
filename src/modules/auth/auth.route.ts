import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import { AuthValidation } from "./auth.validation.js";

const router: Router = Router();

router.post(
  "/register-request",
  rateLimiter({
    maxRequests: 5,
    windowSeconds: 300,
    route: "register-request",
  }),
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
  validateRequest(AuthValidation.resendOtpValidationSchema),
  AuthController.resendOtp,
);

router.post(
  "/login",
  rateLimiter({
    maxRequests: 5,
    windowSeconds: 60,
    route: "login",
  }),
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

router.post(
  "/forgot-password",
  rateLimiter({
    maxRequests: 3,
    windowSeconds: 300,
    route: "forgot-password",
  }),
  validateRequest(AuthValidation.requestPasswordResetValidationSchema),
  AuthController.requestPasswordReset,
);

router.post(
  "/reset-password",
  rateLimiter({
    maxRequests: 3,
    windowSeconds: 300,
    route: "reset-password",
  }),
  validateRequest(AuthValidation.verifyPasswordResetValidationSchema),
  AuthController.verifyPasswordReset,
);

export const AuthRoutes = router;
