import express, { type Request, type Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/index";
import globalErrorHandler from "./common/middlewares/error.middleware";
import notFoundHandler from "./common/middlewares/notFound.middleware";

export async function createApp(): Promise<express.Express> {
  const app = express();

  // Middleware setup
  app.use(
    cors({
      origin: config.allowed_origins?.split(","),
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the classyshop auth service!",
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Service is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: config.serviceName,
      version: config.apiVersion,
    });
  });

  app.use("/api/v1", globalRouter);

  app.use(notFoundHandler);

  app.use(globalErrorHandler);

  return app;
}
