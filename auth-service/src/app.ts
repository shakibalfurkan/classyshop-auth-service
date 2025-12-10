import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import notFoundError from "./middlewares/notFoundError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

export async function createApp(): Promise<express.Express> {
  const app = express();

  // Middleware setup
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the auth service!",
    });
  });

  app.use(globalErrorHandler);
  app.use(notFoundError);

  return app;
}
