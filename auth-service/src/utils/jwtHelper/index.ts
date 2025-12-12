import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: {
    _id?: string;
    name: string;
    email: string;
  },
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn: "15m" });

  return token;
};

export const jwtHelper = {
  createToken,
};
