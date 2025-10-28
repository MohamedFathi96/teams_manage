import { createApp } from "./app";
import { connectToDatabase } from "./db/mongoose";
import { config } from "./config/index";
import { logger } from "./lib/logger";
import { createServer } from "http";

async function start() {
  await connectToDatabase();
  const app = createApp();

  const server = createServer(app);

  server.listen(config.port, () => {
    logger.info(`Server listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", { err });
  process.exit(1);
});
