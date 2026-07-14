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
                className={`flex items-end gap-2 ${isOwnMessage ? "flex-row-reverse" : ""
                    }`}
            >
                {isOwnMessage && (
                    <DropdownMenu
                        open={menuOpen}
                        onOpenChange={setMenuOpen}
                    >
                        <DropdownMenuTrigger
                            className="
                        hidden
                        h-8 w-8
                        items-center justify-center
                        rounded-xl
                        text-slate-400
                        opacity-0
                        transition-all duration-200
                        group-hover:opacity-100
                        hover:bg-slate-800
                        hover:text-white
                        lg:flex
                    "
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="rounded-xl border border-slate-800 bg-slate-900"
                        >
                            <DropdownMenuItem
                                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
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
                    className={`
                        min-w-[140px]
                        max-w-[85%]
                        rounded-[20px]
                        px-4
                        py-2.5
                        shadow-md
                        transition-all duration-200
                        md:max-w-[70%]
                        ${isOwnMessage
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "bg-slate-800 text-slate-100 ring-1 ring-slate-700/50"
                        }
                    `}
                >
                    <p className="break-words text-[15px] leading-5">
                        {message.content}
                    </p>

                    <p
                        className={`mt-1 text-right text-[10px] ${isOwnMessage
                                ? "text-blue-100/80"
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