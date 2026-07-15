"use client";

import { createContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type SocketContextType = {
    socket: typeof socket;
    isConnected: boolean;
    onlineUsers: string[];
};

export const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }


        function handleOnlineUsers(data: {
            userIds: string[];
        }) {
            setOnlineUsers(data.userIds);
        }

        function handleUserOnline(data: {
            userId: string;
        }) {
            setOnlineUsers((previous) => {
                if (previous.includes(data.userId)) {
                    return previous;
                }

                return [...previous, data.userId];
            });
        }

        function handleUserOffline(data: {
            userId: string;
        }) {
            setOnlineUsers((previous) =>
                previous.filter(
                    (id) => id !== data.userId
                )
            );
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("online_users", handleOnlineUsers);
        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);

            socket.off("online_users", handleOnlineUsers);
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                onlineUsers
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}