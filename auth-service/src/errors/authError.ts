import type { Request, Response } from "express";

export const AuthError = (req: Request, res: Response) => {
  res.status(401).json({
    success: false,
    statusCode: 401,
    message: "You have no access to this route",
  });
};
