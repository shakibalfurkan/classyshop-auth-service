import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { auth } from "../../middlewares/auth.js";
import { USER_ROLES } from "../user/user.constant.js";

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

router.post(
  "/login-user",
  validateRequest(AuthValidation.userLoginSchema),
  AuthController.loginUser
);

router.post(
  "/forgot-user-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotUserPassword
);

router.post(
  "/verify-forgot-user-password",
  validateRequest(AuthValidation.verifyForgotUserPassword),
  AuthController.verifyForgotUserPassword
);

router.post(
  "/reset-user-password",
  auth(USER_ROLES.USER),
  validateRequest(AuthValidation.resetUserPasswordSchema),
  AuthController.resetUserPassword
);

export const AuthRoutes: Router = router;
