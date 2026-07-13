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
        <div className="border-t border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur">
            <div className="flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 shadow-lg transition-colors focus-within:border-blue-500">
                <Input
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);

                        if (!socket.connected) return;

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
                    placeholder="Message..."
                    className="
                    h-12
                    flex-1
                    border-0
                    bg-transparent
                    text-white
                    placeholder:text-slate-500
                    shadow-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                "
                />

                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!content.trim()}
                    className="
                    h-8
                    w-8
                    rounded-full
                    bg-blue-600
                    transition-all
                    hover:scale-105
                    hover:bg-blue-700
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:bg-slate-700
                "
                >
                    <SendHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}