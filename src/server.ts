import { createApp } from "./app.js";
import config from "./config/index.js";

const port = process.env.PORT || config.port;

async function main(): Promise<void> {
  try {
    // Create app
    const app = await createApp();

    // Start server
    app.listen(port, () => {
      console.log(`ClassyShop Auth service is listening on port: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

main();
