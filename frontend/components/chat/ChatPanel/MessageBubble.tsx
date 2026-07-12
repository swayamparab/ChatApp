"use client";

import type { Message } from "@/types/message";
import { useRef, useState, useEffect } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical, Trash2 } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";

type MessageBubbleProps = {
    message: Message;
    isOwnMessage: boolean;
};

export default function MessageBubble({
    message,
    isOwnMessage,
}: MessageBubbleProps) {

    const time = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [menuOpen, setMenuOpen] = useState(false);

    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

    const { socket } = useSocket();

    function handleDelete() {
        socket.emit(
            "delete_message",
            {
                messageId: message.id,
            },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    console.error(response.message);
                    return;
                }

                setMenuOpen(false)
            }
        );
    }

    //unmount timer
    useEffect(() => {
        return () => {
            if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
            }
        };
    }, []);

    return (
        <div
            className={`group flex ${isOwnMessage ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`flex items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : ""
                    }`}
            >
                {isOwnMessage && (
                    <DropdownMenu
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                    >
                        <DropdownMenuTrigger
                            className="hidden h-8 w-8 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-700 lg:flex"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-red-500"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <div
                    onTouchStart={() => {
                        if (!isOwnMessage) return;

                        longPressTimeout.current = setTimeout(() => {
                            setMenuOpen(true);
                        }, 500);
                    }}
                    onTouchEnd={() => {
                        if (longPressTimeout.current) {
                            clearTimeout(longPressTimeout.current);
                        }
                    }}
                    onTouchMove={() => {
                        if (longPressTimeout.current) {
                            clearTimeout(longPressTimeout.current);
                        }
                    }}
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow ${isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-white"
                        }`}
                >
                    <p className="break-words text-sm">
                        {message.content}
                    </p>

                    <p
                        className={`mt-1 text-right text-xs ${isOwnMessage
                            ? "text-blue-100"
                            : "text-slate-400"
                            }`}
                    >
                        {time}
                    </p>
                </div>
            </div>
        </div>
    );
}