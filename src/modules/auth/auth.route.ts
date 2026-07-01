import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";

import { AuthValidation } from "./auth.validation.js";

const router: Router = Router();

router.post(
  "/register-request",

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

export const AuthRoutes = router;
