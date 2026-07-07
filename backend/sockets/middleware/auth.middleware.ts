import { ExtendedError, Socket } from "socket.io";
import { parseCookie } from "cookie";
import { verifyToken } from "../../lib/jwt";

export function socketAuth(socket: Socket, next: (err?: ExtendedError)=>void){
    try{
        const cookieHeader = socket.handshake.headers.cookie;

        if(!cookieHeader){
            return next(new Error("Unauthorized"));
        }

        const cookies = parseCookie(cookieHeader);

        const token = cookies.token;

        if(!token){
            return next(new Error("Unauthorized"));
        }

        const payload = verifyToken(token);

        socket.userId = payload.userId;

        next();
    }
    catch(error){
        next(new Error("Unauthorized"));
    }
}