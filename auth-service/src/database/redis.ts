import Redis from "ioredis";
import config from "../config/index.js";

export const redis = new (Redis as any)(config.redis_database_url);
