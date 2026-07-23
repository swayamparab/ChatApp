"use client";

import type { Message } from "@/types/message";
import { useRef, useState, useEffect } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";

type MessageBubbleProps = {
    message: Message;
    isOwnMessage: boolean;
    isLastOwnMessage: boolean;
    lastReadAt: string | null;
};

export default function MessageBubble({
    message,
    isOwnMessage,
    isLastOwnMessage,
    lastReadAt
}: MessageBubbleProps) {

    const time = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isSeen =
        isOwnMessage &&
        lastReadAt !== null &&
        new Date(message.createdAt) <= new Date(lastReadAt);

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditedContent(message.content);
    }, [message.content]);

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

    function handleEdit() {
        const content = editedContent.trim();

        if (!content) {
            toast.error("Edit message cannot be empty");
            return;
        }

        if (content === message.content) {
            setEditedContent(message.content);
            setIsEditing(false);
            return;
        }

        setIsSaving(true);

        socket.emit(
            "edit_message",
            {
                messageId: message.id,
                content,
            },
            (response: { success: boolean; message?: string }) => {
                setIsSaving(false);

                if (!response.success) {
                    console.error(response.message);
                    return;
                }

                setMenuOpen(false);
                setIsEditing(false);
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
                    <div className="hidden lg:block">
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
                                    className="text-white"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditedContent(message.content);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {isOwnMessage && (
                    <Drawer
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <DrawerContent className="border-slate-800 bg-slate-900">
                            <DrawerHeader>
                                <DrawerTitle className="text-white">
                                    Message
                                </DrawerTitle>
                            </DrawerHeader>

                            <div className="space-y-2 px-4 pb-6">
                                <button
                                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-white hover:bg-slate-800"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditedContent(message.content);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <Pencil className="h-5 w-5" />
                                    Edit
                                </button>

                                <button
                                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-red-400 hover:bg-red-500/10"
                                    onClick={() => {
                                        handleDelete();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <Trash2 className="h-5 w-5" />
                                    Delete
                                </button>
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}

                <div
                    onTouchStart={() => {
                        if (!isOwnMessage || isEditing) return;

                        longPressTimeout.current = setTimeout(() => {
                            setMobileMenuOpen(true);
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
                    style={{
                        WebkitUserSelect: "none",
                        WebkitTouchCallout: "none",
                    }}
                    className={`
                                            min-w-[140px]
                                            max-w-[85%]
                                            rounded-[20px]
                                            px-4
                                            py-2.5
                                            shadow-md
                                            transition-all duration-200
                                            select-none
                                            touch-manipulation
                                            md:max-w-[70%]
                                            ${isOwnMessage
                                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                                : "bg-slate-800 text-slate-100 ring-1 ring-slate-700/50"
                                            }
                    `}
                >
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="
                                    w-full
                                    resize-none
                                    rounded-md
                                    border
                                    border-white/20
                                    bg-transparent
                                    p-2
                                    text-[15px]
                                    leading-5
                                    outline-none
                                    focus:border-white/40
                                "
                                rows={2}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleEdit();
                                    }

                                    if (e.key === "Escape") {
                                        setEditedContent(message.content);
                                        setIsEditing(false);
                                    }
                                }}
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    disabled={isSaving}
                                    onClick={() => {
                                        setEditedContent(message.content);
                                        setIsEditing(false);
                                    }}
                                    className="
                    text-xs
                    opacity-80
                    hover:opacity-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleEdit}
                                    disabled={isSaving}
                                    className="
                    text-xs
                    font-medium
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {message.editedAt && (
                                <div
                                    className={`mb-1 text-[11px] font-medium ${isOwnMessage
                                        ? "text-blue-100/80"
                                        : "text-slate-400"
                                        }`}
                                >
                                    (edited)
                                </div>
                            )}

                            <p className="break-words text-[15px] leading-5">
                                {message.content}
                            </p>

                            <div
                                className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isOwnMessage
                                    ? "text-blue-100/80"
                                    : "text-slate-400"
                                    }`}
                            >
                                <span>{time}</span>

                                {isOwnMessage && isLastOwnMessage && (
                                    <span>{isSeen ? "Seen" : "Sent"}</span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}