import { createServer } from "./server";
import { logger } from "./configs/logger";
import { connectToDatabase } from "./configs/db";

import config from "config";

const host = String(config.get("server.host")) || "localhost";
const port = Number(config.get("server.port")) || 3001;

const server = createServer();

server.listen(port, host, async () => {
    try {
        await connectToDatabase(config.get("database.url"));
        logger.info(`Server Listening on port ${port}`);
    } catch (error) {
        logger.error(String(error));

        process.exit(1);
    }
});
