import {Server as HttpServer} from "http"
import {Server} from "socket.io"
import { env } from "../config/env"

export function createSocketServer(server: HttpServer){
    const io = new Server(server, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    })

    io.on("connection", (socket)=>{
        console.log(`Client connected: ${socket.id}`)

        socket.on("disconnect", ()=>{
            console.log(`Client disconnected: ${socket.id}`)
        })
    })

    return io;
}
