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
    isHighlighted: boolean
};

export default function MessageBubble({
    message,
    onReply,
    isOwnMessage,
    isLastOwnMessage,
    lastReadAt,
    isHighlighted
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
            id={`message-${message.id}`}
            className={`
                group
                flex

                animate-in
                fade-in
                slide-in-from-bottom-2
                duration-200

                ${isOwnMessage ? "justify-end" : "justify-start"}

                ${isHighlighted
                    ? "rounded-full bg-sky-500/15 ring-2 ring-sky-400/30"
                    : ""
                }
            `}
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
                    <DrawerContent className="rounded-t-3xl border-slate-800 bg-slate-900 px-2 pb-4">
                        <DrawerHeader className="pb-2">
                            <DrawerTitle className="text-center text-base font-semibold text-white">
                                Message
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="space-y-2 px-4 pb-6">
                            <button
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-4
                                    rounded-xl
                                    px-4
                                    py-3.5
                                    text-left
                                    text-sm
                                    font-medium
                                    text-slate-100
                                    transition-all
                                    hover:bg-slate-800
                                    active:scale-[0.98]
                                "
                                onClick={() => {
                                    onReply(message);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <div className="rounded-full bg-blue-500/15 p-2">
                                    <Reply className="h-5 w-5 text-blue-400" />
                                </div>
                                <span>Reply</span>
                            </button>
                            {message.type === "text" && (
                                <button
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-4
                                        rounded-xl
                                        px-4
                                        py-3.5
                                        text-left
                                        text-sm
                                        font-medium
                                        text-slate-100
                                        transition-all
                                        hover:bg-slate-800
                                        active:scale-[0.98]
                                    "
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(message.content ?? "");
                                        toast.success("Message copied!");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    <div className="rounded-full bg-emerald-500/15 p-2">
                                        <Copy className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <span>Copy</span>
                                </button>
                            )}
                            {isOwnMessage && (
                                <>
                                    {message.type === "text" && (
                                        <button
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-4
                                                rounded-xl
                                                px-4
                                                py-3.5
                                                text-left
                                                text-sm
                                                font-medium
                                                text-slate-100
                                                transition-all
                                                hover:bg-slate-800
                                                active:scale-[0.98]
                                            "
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditedContent(message.content ?? "");
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <div className="rounded-full bg-amber-500/15 p-2">
                                                <Pencil className="h-5 w-5 text-amber-400" />
                                            </div>
                                            <span>Edit</span>
                                        </button>
                                    )}

                                    <button
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-4
                                            rounded-xl
                                            px-4
                                            py-3.5
                                            text-left
                                            text-sm
                                            font-medium
                                            text-slate-100
                                            transition-all
                                            hover:bg-slate-800
                                            active:scale-[0.98]
                                        "
                                        onClick={() => {
                                            handleDelete();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <div className="rounded-full bg-red-500/15 p-2">
                                            <Trash2 className="h-5 w-5 text-red-400" />
                                        </div>
                                        <span className="text-red-400">
                                            Delete
                                        </span>
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

                        max-w-[82%]
                        sm:max-w-[76%]
                        lg:max-w-[66%]
                        xl:max-w-[60%]

                        ${message.type === "image" || message.type === "file"
                            ? "rounded-2xl"
                            : "rounded-[22px]"
                        }

                        ${message.type === "image"
                            ? "p-1"
                            : message.type === "file"
                                ? "p-2"
                                : message.type === "voice"
                                    ? "w-[320px] max-w-full px-3 py-2 overflow-hidden"
                                    : "px-4 py-3"
                        }

                        shadow-[0_4px_18px_rgba(0,0,0,0.16)]
                        transition-all
                        duration-200
                        ease-out
                        will-change-transform
                        hover:scale-[1.01]
                        active:scale-[0.99]

                        hover:-translate-y-[1px]
                        hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]

                        select-none
                        touch-manipulation

                        ${isOwnMessage
                            ? "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white"
                            : "bg-slate-800 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
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
                                        mb-2
                                        overflow-hidden
                                        rounded-xl
                                        border-l-[3px]
                                        px-3
                                        py-2

                                        ${isOwnMessage
                                            ? "border-blue-200 bg-white/10 backdrop-blur-sm"
                                            : "border-sky-400 bg-slate-700/70 backdrop-blur-sm"
                                        }
                                    `}
                                >
                                    <p
                                        className={`
                                            text-[12px]
                                            font-semibold
                                            tracking-wide
                                            ${isOwnMessage
                                                ? "text-blue-100"
                                                : "text-sky-400"
                                            }
                                        `}
                                    >
                                        {message.replyTo.sender.username}
                                    </p>

                                    <p
                                        className={`
                                        mt-1
                                        line-clamp-2
                                        text-[13px]
                                        leading-5
                                        ${isOwnMessage
                                                ? "text-blue-50/90"
                                                : "text-slate-300"
                                            }
                                    `}
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
                                <p
                                    className="
                                        break-words
                                        whitespace-pre-wrap
                                        text-[15px]
                                        leading-6
                                        tracking-[0.01em]
                                        font-normal
                                    "
                                >
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
                                        className="
                                            block
                                            h-auto
                                            w-full
                                            cursor-pointer
                                            rounded-[16px]
                                            object-cover

                                            transition-transform
                                            duration-300

                                            hover:scale-[1.02]
                                        "
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
                                    waveform={message.waveform ?? []}
                                    duration={message.duration ?? 0}
                                />
                            )}

                            <div
                                className={`mt-2 flex items-center justify-end gap-1 text-[11px] font-medium ${isOwnMessage
                                    ? "text-blue-100/75"
                                    : "text-slate-500"
                                    }`}
                            >

                                <span>{time}</span>

                                {isOwnMessage && isLastOwnMessage && (
                                    <span>{isSeen ? "seen" : "sent"}</span>
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