"use client";

import type { Message } from "@/types/message";

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

    return (
        <div
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                }`}
        >
            <div
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
    );
}