import jwt, { type JwtPayload } from "jsonwebtoken";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
} from "../errors/AppError.js";

export interface ITokenPayload {
  id: string;
  role: string;
  email: string;
  tokenType?: "access" | "refresh";
}

export interface IDecodedToken extends ITokenPayload, JwtPayload {
  iat: number;
  exp: number;
}

const generateToken = (
  jwtPayload: ITokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn } as jwt.SignOptions);
  return token;
};

const verifyToken = (
  token: string,
  secret: string,
  expectedType?: "access" | "refresh",
): IDecodedToken => {
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  if (!secret) {
    throw new AppError(400, "JWT secret is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    }) as IDecodedToken;

    if (expectedType && decoded.tokenType !== expectedType) {
      throw new ForbiddenError(
        `Invalid token type. Expected ${expectedType} token`,
      );
    }

    return decoded;
  } catch (error: any) {
    throw new UnauthorizedError(error.message);
  }
};

export const JwtHelpers = {
  generateToken,
  verifyToken,
};
