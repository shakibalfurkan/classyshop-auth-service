import type { Response } from "express";
import config from "../config/index.js";

export const setCookie = (
  res: Response,
  tokenName: string,
  tokenValue: string,
  maxAge: number = 7 * 24 * 60 * 60 * 1000,
) => {
  const isProd = config.node_env !== "development";

  res.cookie(tokenName, tokenValue, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge,
    path: "/",
  });
};
