import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { auth } from "../../middlewares/auth.js";
import { USER_ROLES } from "../../constant/index.js";

const router = Router();

// user routes
router.post(
  "/users/register",
  validateRequest(AuthValidation.userRegistrationSchema),
  AuthController.registerUser
);

router.post(
  "/users/verify",
  validateRequest(AuthValidation.userVerificationSchema),
  AuthController.verifyUser
);

router.post(
  "/users/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/users/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotUserPassword
);

router.post(
  "/users/reset-password",
  validateRequest(AuthValidation.resetUserPasswordSchema),
  AuthController.resetUserPassword
);

router.patch(
  "/users/change-password",
  auth(USER_ROLES.USER),
  validateRequest(AuthValidation.changeUserPasswordSchema),
  AuthController.resetUserPassword
);

// common routes
router.post("/token-check", AuthController.tokenCheck);

router.post("/refresh-token", AuthController.refreshToken);

router.get("/users/me", auth(USER_ROLES.USER), AuthController.getUser);

router.post("/logout", AuthController.logout);

// seller routes

router.post(
  "/sellers/register",
  validateRequest(AuthValidation.sellerRegistrationSchema),
  AuthController.registerSeller
);

router.post(
  "/sellers/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginSeller
);

router.get("/sellers/me", auth(USER_ROLES.SELLER), AuthController.getSeller);

router.post(
  "/sellers/verify",
  validateRequest(AuthValidation.sellerVerificationSchema),
  AuthController.verifySeller
);

router.post(
  "/sellers/create-shop",
  auth(USER_ROLES.SELLER),
  validateRequest(AuthValidation.createShopValidationSchema),
  AuthController.createShop
);

router.post(
  "/sellers/create-stripe-connection-link",
  auth(USER_ROLES.SELLER),
  AuthController.createStripeConnectionLink
);

router.get(
  "/sellers/my-shop",
  auth(USER_ROLES.SELLER),
  AuthController.getShopBySellerId
);

export const AuthRoutes: Router = router;
