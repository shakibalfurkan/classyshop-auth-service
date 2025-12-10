import { createApp } from "./app.js";

const port = process.env.PORT || 8080;

async function main(): Promise<void> {
  try {
    // Create app
    const app = await createApp();

    // Start server
    app.listen(port, () => {
      console.log(`API Gateway service is listening on port: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

main();
