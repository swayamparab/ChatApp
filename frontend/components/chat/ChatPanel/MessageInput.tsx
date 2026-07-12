"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";

export default function MessageInput() {
    const [content, setContent] = useState("");

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { socket } = useSocket();

    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    function handleSend() {
        const message = content.trim();

        if (!message) {
            return;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socket.emit("send_message",
            {
                conversationId,
                content: message,
            },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    console.error(response.message);
                    return;
                }

                setContent("");
                socket.emit("stop_typing", {
                    conversationId,
                });
                isTypingRef.current = false;
            }
        );
    }

    //clean up timeout when user switches
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            if (socket.connected && isTypingRef.current) {
                socket.emit("stop_typing", {
                    conversationId,
                });
            }
        };
    }, [conversationId, socket]);

    return (
        <div className="border-t border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-3">
                <Input
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);

                        if (!socket.connected) {
                            return;
                        }

                        if (!isTypingRef.current) {
                            socket.emit("typing", {
                                conversationId,
                            });

                            isTypingRef.current = true;
                        }

                        if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                        }

                        typingTimeoutRef.current = setTimeout(() => {
                            socket.emit("stop_typing", {
                                conversationId,
                            });

                            isTypingRef.current = false;
                        }, 1000);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1"
                />

                <Button
                    size="icon"
                    onClick={handleSend}
                >
                    <SendHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}