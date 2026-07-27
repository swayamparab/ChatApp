"use client";

import { Download, X } from "lucide-react";
import { useEffect } from "react";

type ImageViewerProps = {
    imageUrl: string;
    onClose: () => void;
};

export default function ImageViewer({
    imageUrl,
    onClose,
}: ImageViewerProps) {

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            <a
                href={imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-16 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
                <Download size={24} />
            </a>
            <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
                <X size={24} />
            </button>

            <img
                src={imageUrl}
                alt="Full size"
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}