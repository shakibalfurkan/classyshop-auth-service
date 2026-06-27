import { createApp } from "./app.js";
import config from "./config/index.js";
import { redisClient } from "./config/redis.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || config.port;

async function main(): Promise<void> {
  try {
    // Create app
    const app = createApp();

    await redisClient.ping();
    logger.info("Redis Database handshake verified successfully.");

    // Start server
    app.listen(port, () => {
      logger.info(`${config.serviceName} is listening on port: ${port}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
  }
}

main();
