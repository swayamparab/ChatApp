import "dotenv/config";
import { env } from "./config/env";

import http from "http";

import app from "./app";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});