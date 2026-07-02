import jwt from "jsonwebtoken";

export interface ITokenPayload {
  id: string;
  role: string;
  email: string;
  tokenType?: "access" | "refresh" | "reset";
}

export const generateToken = (
  jwtPayload: ITokenPayload,
  secret: string,
  expiresIn: string,
): string => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn } as jwt.SignOptions);
  return token;
};
