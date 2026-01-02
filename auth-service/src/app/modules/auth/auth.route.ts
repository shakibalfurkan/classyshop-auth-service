import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { auth } from "../../middlewares/auth.js";
import { USER_ROLES } from "../../constant/index.js";

const router = Router();

// user routes
router.post(
  "/user/register",
  validateRequest(AuthValidation.userRegistrationSchema),
  AuthController.registerUser
);

router.post(
  "/user/verify",
  validateRequest(AuthValidation.userVerificationSchema),
  AuthController.verifyUser
);

router.post(
  "/user/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/user/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotUserPassword
);

router.post(
  "/user/reset-password",
  validateRequest(AuthValidation.resetUserPasswordSchema),
  AuthController.resetUserPassword
);

router.patch(
  "/user/change-password",
  auth(USER_ROLES.USER),
  validateRequest(AuthValidation.changeUserPasswordSchema),
  AuthController.resetUserPassword
);

// common routes
router.post("/token-check", AuthController.tokenCheck);

router.post("/refresh-token", AuthController.refreshToken);

router.get(
  "/me",
  auth(USER_ROLES.USER, USER_ROLES.SELLER, USER_ROLES.ADMIN),
  AuthController.getMe
);

router.post("/logout", AuthController.logout);

// seller routes
router.post(
  "/seller/register",
  validateRequest(AuthValidation.sellerRegistrationSchema),
  AuthController.registerSeller
);

router.post(
  "/seller/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginSeller
);

router.post(
  "/seller/verify",
  validateRequest(AuthValidation.sellerVerificationSchema),
  AuthController.verifySeller
);

router.post(
  "/seller/create-shop",
  auth(USER_ROLES.SELLER),
  validateRequest(AuthValidation.createShopValidationSchema),
  AuthController.createShop
);

router.post(
  "/seller/create-stripe-connection-link",
  auth(USER_ROLES.SELLER),
  AuthController.createStripeConnectionLink
);

router.get(
  "/seller/my-shop",
  auth(USER_ROLES.SELLER),
  AuthController.getShopBySellerId
);

export const AuthRoutes: Router = router;
