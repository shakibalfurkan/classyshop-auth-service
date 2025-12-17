import type { Response } from "express";
import config from "../config/index.js";

export const setCookie = (
  res: Response,
  tokenName: string,
  tokenValue: string
) => {
  const isProd = config.node_env === "production";

  res.cookie(tokenName, tokenValue, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });
};
