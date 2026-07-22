"use client";

import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { useSocket } from "@/hooks/useSocket";
import { useMarkConversationAsRead } from "@/hooks/useMarkConversationAsRead";

import { useParams } from "next/navigation";

export default function ChatPanel() {
    const { socket } = useSocket();

    const { markConversationAsRead } =
        useMarkConversationAsRead();

    const { conversationId } = useParams<{
        conversationId: string;
    }>();

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        markConversationAsRead(conversationId);
    }, [conversationId, markConversationAsRead]);

    useEffect(() => {
        function handleTyping(data: {
            conversationId: string;
            userId: string;
        }) {
            if (data.conversationId !== conversationId) return;

            setIsTyping(true);
        }

        function handleStopTyping(data: {
            conversationId: string;
            userId: string;
        }) {
            if (data.conversationId !== conversationId) return;

            setIsTyping(false);
        }

        socket.on("user_typing", handleTyping);
        socket.on("user_stop_typing", handleStopTyping);

        return () => {
            socket.off("user_typing", handleTyping);
            socket.off("user_stop_typing", handleStopTyping);
        };
    }, [socket]);

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ChatHeader isTyping={isTyping} />

            <MessageList />

            <MessageInput />
        </div>
    );
}