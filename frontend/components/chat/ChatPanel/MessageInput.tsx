"use client";

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";


export default function MessageInput() {

    const [content, setContent] = useState("");

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { socket } = useSocket();

    function handleSend() {
        const message = content.trim();

        if (!message) {
            return
        }

        socket.emit("send_message", {
            conversationId,
            content: message,
        },
            (response: {
                success: boolean,
                message?: string
            }) => {
                if (!response.success) {
                    console.error(response.message)
                    return
                }

                setContent("");
            }
        )
    }

    return (
        <div className="border-t border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-3">
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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