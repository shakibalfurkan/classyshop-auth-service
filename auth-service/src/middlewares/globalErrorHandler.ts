import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import AppError from "../errors/AppError.js";
import type { TErrorSources } from "../interfaces/error.js";
import handleZodError from "../errors/handleZodError.js";
import handleDuplicateError from "../errors/handleDuplicateError.js";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  //setting default values
  let statusCode = 500;
  let message = "Something went wrong";

  let errorMessages: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  //check for validation error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: err?.stack,
  });
};

export default globalErrorHandler;
