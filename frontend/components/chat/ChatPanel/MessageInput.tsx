"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Loader2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";
import { useUploadImage } from "@/hooks/useUploadImage";

import type { Message } from "@/types/message";

interface MessageInputProps {
    replyingTo: Message | null;
    clearReply: () => void;
}

export default function MessageInput({
    replyingTo,
    clearReply
}: MessageInputProps) {
    const [content, setContent] = useState("");

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { socket } = useSocket();

    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const uploadImageMutation = useUploadImage();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);

    //focus input box
    const inputRef = useRef<HTMLInputElement>(null);
    //when a conversation is opened or reply to message is initiated only for desktop
    useEffect(() => {
        const isDesktop = window.matchMedia("(pointer: fine)").matches;

        if (isDesktop) {
            inputRef.current?.focus({
                preventScroll: true,
            });
        }
    }, [conversationId, replyingTo]);

    function handleSend() {
        const message = content.trim();

        if (!message) {
            return;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }

        socket.emit("send_message",
            {
                conversationId,
                content: message,
                replyToMessageId: replyingTo?.id,
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
                clearReply();

                socket.emit("stop_typing", {
                    conversationId,
                });
                isTypingRef.current = false;
            }
        );
    }

    async function handleImageSelect(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            setIsUploading(true);

            const upload = await uploadImageMutation.mutateAsync(file);

            socket.emit(
                "send_image",
                {
                    conversationId,
                    attachmentUrl: upload.attachmentUrl,
                    attachmentMimeType: upload.attachmentMimeType,
                    attachmentSize: upload.attachmentSize,
                    replyToMessageId: replyingTo?.id,
                },
                (response: {
                    success: boolean;
                    message?: string;
                }) => {
                    if (!response.success) {
                        console.error(response.message);
                        return;
                    }

                    clearReply();

                    socket.emit("stop_typing", {
                        conversationId,
                    });

                    isTypingRef.current = false;

                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = null;
                    }
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    }

    //clean up timeout when user switches
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
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
            {replyingTo && (
                <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 border-l-4 border-blue-500 pl-3">
                            <p className="text-xs font-semibold text-blue-400">
                                Replying to {replyingTo.sender.username}
                            </p>

                            <p className="truncate text-sm text-slate-300">
                                {replyingTo.content}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearReply}
                        >
                            ✕
                        </Button>
                    </div>
                </div>
            )}
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
                <input
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ImageIcon className="h-5 w-5" />
                    )}
                </Button>
                <Input
                    ref={inputRef}
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
                        if (e.key === "Escape" && replyingTo) {
                            clearReply();
                            return;
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