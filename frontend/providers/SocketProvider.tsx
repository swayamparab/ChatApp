"use client";

import { createContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type SocketContextType = {
    socket: typeof socket;
    isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}