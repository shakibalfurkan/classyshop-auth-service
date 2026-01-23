import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import config from "./config/index.js";
import globalErrorHandler from "./common/middlewares/error.middleware.js";
import notFoundHandler from "./common/middlewares/notFound.middleware.js";
import helmet from "helmet";
import morgan from "morgan";
import { morganStream } from "./lib/logger.js";
import { authRoutes } from "./modules/auth/auth.route.js";

export async function createApp(): Promise<Application> {
  const app: Application = express();

  // Middleware setup
  app.use(helmet());
  app.use(
    cors({
      origin: config.allowed_origins?.split(","),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  if (config.isDevelopment) {
    app.use(morgan("dev", { stream: morganStream }));
  } else {
    app.use(morgan("combined", { stream: morganStream }));
  }

  app.use((req, _res, next) => {
    req.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    next();
  });

  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: `Welcome to the ClassyShop ${config.serviceName} API!`,
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Service is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: config.serviceName,
    });
  });

  app.use("/api/v1", authRoutes);

  app.use(notFoundHandler);

  app.use(globalErrorHandler);

  return app;
}
