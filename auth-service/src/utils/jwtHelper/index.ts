import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  },
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn } as jwt.SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
