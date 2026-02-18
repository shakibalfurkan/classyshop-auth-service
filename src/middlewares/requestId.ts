import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let requestId = req.headers["x-request-id"] as string;

  if (!requestId) {
    requestId = uuidv4();
    req.headers["x-request-id"] = requestId;
  }

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
};
