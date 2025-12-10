import type { NextFunction, Request, Response } from "express";

const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Resource not found",
  });
};

export default notFoundError;
