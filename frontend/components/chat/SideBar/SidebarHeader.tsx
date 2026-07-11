"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MoreVertical } from "lucide-react";

export default function SidebarHeader() {
    const { data } = useCurrentUser();

    if (!data) return null;

    return (
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        {data.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate font-medium">
                        {data.user.username}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                        {data.user.email}
                    </p>
                </div>
            </div>

            <button
                className="rounded-md p-2 transition-colors hover:bg-slate-800"
                aria-label="More options"
            >
                <MoreVertical className="h-5 w-5 text-slate-400" />
            </button>
        </div>
    );
}