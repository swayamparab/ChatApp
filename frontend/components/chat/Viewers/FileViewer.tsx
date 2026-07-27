"use client";

import { useEffect } from "react";
import { Download, X } from "lucide-react";

type FileViewerProps = {
    fileUrl: string;
    fileName: string;
    mimeType: string;
    onClose: () => void;
};

export default function FileViewer({
    fileUrl,
    fileName,
    mimeType,
    onClose,
}: FileViewerProps) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white"
            >
                <X />
            </button>

            <a
                href={fileUrl}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-16 top-4 z-10 rounded-full bg-black/50 p-2 text-white"
            >
                <Download />
            </a>

            <div
                className="flex h-full items-center justify-center p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {mimeType === "application/pdf" ? (
                    <iframe
                        src={fileUrl}
                        title={fileName}
                        className="h-[90vh] w-[90vw] rounded-lg bg-white"
                    />
                ) : (
                    <div className="rounded-lg bg-zinc-900 p-8 text-center text-white">
                        <h2 className="mb-2 text-lg font-semibold">{fileName}</h2>

                        <p className="mb-6 text-sm text-zinc-400">
                            Preview isn't available for this file type.
                        </p>

                        <a
                            href={fileUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-700"
                        >
                            Download File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}