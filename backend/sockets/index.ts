import {Server as HttpServer} from "http"
import {Server} from "socket.io"
import { env } from "../config/env"
import { handleConnection } from "./events/connection.event"

export function createSocketServer(server: HttpServer){
    const io = new Server(server, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    })

    io.on("connection", (socket)=>{
        handleConnection(socket)
    })

    return io;
}
