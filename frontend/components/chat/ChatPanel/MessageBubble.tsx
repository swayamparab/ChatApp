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

import { EllipsisVertical, Pencil, Trash2, Copy, Reply } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";

import Image from "next/image";

import ImageViewer from "@/components/chat/Viewers/ImageViewer";
import VideoViewer from "@/components/chat/Viewers/VideoViewer";
import FileViewer from "@/components/chat/Viewers/FileViewer";
import VoiceMessage from "../VoiceMessage";

type MessageBubbleProps = {
    message: Message;
    onReply: (message: Message) => void;
    isOwnMessage: boolean;
    isLastOwnMessage: boolean;
    lastReadAt: string | null;
};

export default function MessageBubble({
    message,
    onReply,
    isOwnMessage,
    isLastOwnMessage,
    lastReadAt,
}: MessageBubbleProps) {
    const { socket } = useSocket();

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
    const [editedContent, setEditedContent] = useState(message.content ?? "");
    const [isSaving, setIsSaving] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<{
        url: string;
        name: string;
        mimeType: string;
    } | null>(null);

    useEffect(() => {
        setEditedContent(message.content ?? "");
    }, [message.content]);

    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);


    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // when editing initiated, move caret to end
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const length = textareaRef.current.value.length;

            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(length, length);
        }
    }, [isEditing]);

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

        if (content === (message.content ?? "")) {
            setEditedContent(message.content ?? "");
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
                                    onReply(message);
                                    setMenuOpen(false);
                                }}
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                            </DropdownMenuItem>
                            {message.type === "text" && (
                                <DropdownMenuItem
                                    className="text-white"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(message.content ?? "");
                                        toast.success("Message Copied!");
                                        setMenuOpen(false);
                                    }}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </DropdownMenuItem>
                            )}
                            {isOwnMessage && (
                                <>
                                    {message.type === "text" && (
                                        <DropdownMenuItem
                                            className="text-white"
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditedContent(message.content ?? "");
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
                                    onReply(message);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <Reply className="h-5 w-5" />
                                Reply
                            </button>
                            {message.type === "text" && (
                                <button
                                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-white hover:bg-slate-800"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(message.content ?? "");
                                        toast.success("Message copied!");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <Copy className="h-5 w-5" />
                                    Copy
                                </button>
                            )}
                            {isOwnMessage && (
                                <>
                                    {message.type === "text" && (
                                        <button
                                            className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-white hover:bg-slate-800"
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditedContent(message.content ?? "");
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Pencil className="h-5 w-5" />
                                            Edit
                                        </button>
                                    )}

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
                                </>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>

                <div
                    onTouchStart={() => {
                        if (isEditing) return;

                        longPressTimeout.current = setTimeout(() => {
                            setMobileMenuOpen(true);
                        }, 350);
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
                        ${message.type === "text" ? "min-w-[140px]" : ""}

                        max-w-[85%]
                        md:max-w-[70%]

                        ${message.type === "image" || message.type === "file"
                            ? "rounded-xl"
                            : "rounded-[20px]"
                        }

                        ${message.type === "image"
                            ? "p-1"
                            : message.type === "file"
                                ? "p-2"
                                : message.type === "voice"
                                    ? "px-3 py-2"
                                    : "px-4 py-2.5"
                        }

                        shadow-md
                        transition-all
                        duration-200
                        select-none
                        touch-manipulation

                        ${isOwnMessage
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "bg-slate-800 text-slate-100 ring-1 ring-slate-700/50"
                        }
                    `}
                >
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                ref={textareaRef}
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleEdit();
                                    }

                                    if (e.key === "Escape") {
                                        setEditedContent(message.content ?? "");
                                        setIsEditing(false);
                                    }
                                }}
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    disabled={isSaving}
                                    onClick={() => {
                                        setEditedContent(message.content ?? "");
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
                            {message.replyTo && (
                                <div
                                    className={`
                                        mb-2 rounded-lg border-l-4 px-3 py-2
                                        ${isOwnMessage
                                            ? "border-blue-200 bg-blue-400/20"
                                            : "border-blue-500 bg-slate-700/60"
                                        }
                                    `}
                                >
                                    <p
                                        className={`text-xs font-semibold ${isOwnMessage
                                            ? "text-blue-100"
                                            : "text-blue-400"
                                            }`}
                                    >
                                        {message.replyTo.sender.username}
                                    </p>

                                    <p
                                        className={`mt-1 line-clamp-2 text-xs ${isOwnMessage
                                            ? "text-blue-50/90"
                                            : "text-slate-300"
                                            }`}
                                    >
                                        {message.replyTo.type === "text"
                                            ? message.replyTo.content
                                            : message.replyTo.type === "image"
                                                ? "📷 Image"
                                                : message.replyTo.type === "video"
                                                    ? "🎥 Video"
                                                    : message.replyTo.type === "voice"
                                                        ? "🎤 Voice message"
                                                        : message.replyTo.type === "file"
                                                            ? "📄 File"
                                                            : ""}
                                    </p>
                                </div>
                            )}
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

                            {message.type === "text" && (
                                <p className="break-words text-[15px] leading-5">
                                    {message.content}
                                </p>
                            )}

                            {message.type === "image" && message.attachmentUrl && (
                                <div className="max-w-[320px] overflow-hidden rounded-2xl">
                                    <Image
                                        onClick={() => setSelectedImage(message.attachmentUrl!)}
                                        src={message.attachmentUrl!}
                                        alt="Image"
                                        width={800}
                                        height={800}
                                        className=" cursor-pointer block w-full h-auto rounded-[16px] object-cover"
                                        onLoadingComplete={() => {
                                            window.dispatchEvent(new Event("message-image-loaded"));
                                        }}
                                    />
                                </div>
                            )}
                            {message.type === "video" && (
                                <div className="relative w-fit">
                                    <video
                                        src={message.attachmentUrl!}
                                        controls
                                        preload="metadata"
                                        className="max-h-96 rounded-lg"
                                    />

                                    <button
                                        onClick={() => setSelectedVideo(message.attachmentUrl!)}
                                        className="absolute bottom-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                                    >
                                        ⛶
                                    </button>
                                </div>
                            )}
                            {message.type === "file" && (
                                <button
                                    onClick={() =>
                                        setSelectedFile({
                                            url: message.attachmentUrl!,
                                            name: message.attachmentName!,
                                            mimeType: message.attachmentMimeType!,
                                        })
                                    }
                                    className="w-full rounded-lg border p-4 text-left hover:bg-muted"
                                >
                                    <div className="font-medium">
                                        📄 {message.attachmentName}
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {message.attachmentMimeType}
                                    </div>
                                </button>
                            )}
                            {message.type === "voice" && (
                                <VoiceMessage
                                    url={message.attachmentUrl!}
                                />
                            )}

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
            {selectedImage && (
                <ImageViewer
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
            {selectedVideo && (
                <VideoViewer
                    videoUrl={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
            {selectedFile && (
                <FileViewer
                    fileUrl={selectedFile.url}
                    fileName={selectedFile.name}
                    mimeType={selectedFile.mimeType}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>

    );
}