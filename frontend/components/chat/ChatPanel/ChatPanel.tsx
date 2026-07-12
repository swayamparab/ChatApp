"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { useSocket } from "@/hooks/useSocket";

export default function ChatPanel() {

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { socket } = useSocket();

    useEffect(() => {
        if (!conversationId || !socket.connected) {
            return;
        }

        socket.emit("join_conversation",
            { conversationId },
            (response: { success: boolean; message?: string }) => {
                console.log(response);
            }
        );
    }, [conversationId, socket.connected]);

    return (
        <div className="flex h-full flex-col">
            <ChatHeader />

            <MessageList />

            <MessageInput />
        </div>
    );
}