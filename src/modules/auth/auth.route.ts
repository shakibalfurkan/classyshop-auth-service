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

export const AuthRoutes = router;
