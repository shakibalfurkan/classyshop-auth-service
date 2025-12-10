import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import httpProxy from "express-http-proxy";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function createApp(): Promise<express.Express> {
  const app = express();

  // Middleware
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json({ limit: "100mb" }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req: Request): number => (req.user ? 500 : 100),
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: true,
    keyGenerator: (req: any) => ipKeyGenerator(req),
  });

  app.use(limiter);

  app.use("/auth", httpProxy("http://localhost:5000"));

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the API Gateway service!",
    });
  });

  return app;
}
