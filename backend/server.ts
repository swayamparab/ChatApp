import "dotenv/config";
import { env } from "./config/env";
import http from "http";
import app from "./app";
import { createSocketServer } from "./sockets";

const server = http.createServer(app);

createSocketServer(server)

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});