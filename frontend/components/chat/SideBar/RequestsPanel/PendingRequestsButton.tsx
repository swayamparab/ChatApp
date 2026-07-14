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
            className="
        mx-3 mt-3
        flex items-center justify-between
        rounded-2xl
        bg-gradient-to-r
        from-blue-500/10
        via-blue-500/5
        to-transparent
        px-4 py-3
        transition-all duration-200
        hover:from-blue-500/20
        hover:via-blue-500/10
        hover:shadow-md
    "
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                    <Bell className="h-5 w-5 text-blue-400" />
                </div>

                <div className="text-left">
                    <p className="font-semibold tracking-tight text-white">
                        Pending Requests
                    </p>

                    <p className="text-xs text-slate-400">
                        View incoming & outgoing requests.
                    </p>
                </div>
            </div>

            {count > 0 && (
                <span
                    className="
                        flex h-6 min-w-6 items-center justify-center
                        rounded-full
                        bg-blue-600
                        px-2
                        text-xs
                        font-semibold
                        text-white
                        shadow-md
                    "
                >
                    {count}
                </span>
            )}
        </button>
    );
}