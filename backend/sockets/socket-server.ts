import { Server } from "socket.io";

let io: Server;

export function setSocketServer(server: Server) {
    io = server;
}

export function getSocketServer() {
    if (!io) {
        throw new Error("Socket server not initialized.");
    }

    return io;
}