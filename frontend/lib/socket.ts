import { io } from "socket.io-client";

const socketUrl =
    process.env.NODE_ENV === "production"
        ? undefined
        : process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = io(socketUrl, {
    withCredentials: true,
    autoConnect: false,
});