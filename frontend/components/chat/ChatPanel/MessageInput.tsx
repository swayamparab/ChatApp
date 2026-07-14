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
        <div className="bg-slate-950/90 px-5 py-4 backdrop-blur-md">
            <div
                className="
                    flex items-center
                    rounded-full
                    bg-slate-900
                    pl-3
                    pr-1.5
                    shadow-lg
                    ring-1 ring-slate-800/70
                "
            >
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
                    placeholder="Type a message..."
                    className="
                        h-12
                        flex-1
                        border-0
                        bg-transparent
                        px-2
                        text-[15px]
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
                        h-10
                        w-10
                        rounded-full
                        bg-gradient-to-br
                        from-blue-500
                        to-blue-600
                        shadow-md
                        transition-all duration-200
                        hover:scale-105
                        hover:from-blue-400
                        hover:to-blue-500
                        active:scale-95
                        disabled:scale-100
                        disabled:bg-slate-700
                        disabled:from-slate-700
                        disabled:to-slate-700
                    "
                >
                    <SendHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}