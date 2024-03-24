import { createServer } from "./server";
import { logger } from "./configs/logger";

const host = "localhost";
const port = 3001;

const server = createServer();

server.listen(port, host, () => {
  try {
    logger.info(`Server Listening on port ${port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
