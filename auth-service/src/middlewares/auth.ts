import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../errors/AppError.js";
import { jwtHelper } from "../utils/jwtHelper/index.js";
import config from "../config/index.js";
import type { JwtPayload } from "jsonwebtoken";
import { USER_ROLES } from "../constant/index.js";
import User from "../modules/user/user.model.js";
import { AuthError } from "../errors/authError.js";
import Seller from "../modules/seller/seller.model.js";

export const auth = (
  ...requiredRoles: (typeof USER_ROLES)[keyof typeof USER_ROLES][]
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.userAccessToken ||
      req.cookies.sellerAccessToken ||
      req.cookies.adminAccessToken ||
      req.headers.authorization?.split(" ")[1];

    console.log({ token });

    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }

    const decodedToken = jwtHelper.verifyToken(
      token,
      config.jwt_access_token_secret!
    ) as JwtPayload;

    const { id, email, role } = decodedToken;

    const user =
      role === USER_ROLES.USER
        ? await User.findOne({ email })
        : role === USER_ROLES.SELLER
        ? await Seller.findOne({ email })
        : null;

    if (!user) {
      throw new AppError(401, "You are not authorized!");
    }

    if (!requiredRoles.includes(role)) {
      return AuthError(req, res);
    }

    req.user = {
      id: user._id,
      email: user.email,
      role,
    };

    next();
  });
};
