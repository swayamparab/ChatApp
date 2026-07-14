"use client";

import { Bell } from "lucide-react";

type PendingRequestsButtonProps = {
    onClick: () => void;
    count?: number;
};

export default function PendingRequestsButton({
    onClick,
    count = 0,
}: PendingRequestsButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-between border-b border-slate-800 px-4 py-3 transition-colors hover:bg-slate-800"
        >
            <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-300" />

                <span className="font-medium text-white">
                    Pending Requests
                </span>
            </div>

            {count > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    {count}
                </span>
            )}
        </button>
    );
}