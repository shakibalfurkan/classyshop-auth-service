import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";

const router = Router();

router.post(
  "/register-user",
  validateRequest(AuthValidation.userRegistrationSchema),
  AuthController.registerUser
);

router.post(
  "/verify-user",
  validateRequest(AuthValidation.userVerificationSchema),
  AuthController.verifyUser
);

export const AuthRoutes: Router = router;
