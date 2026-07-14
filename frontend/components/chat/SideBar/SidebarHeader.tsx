"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "@/hooks/useCurrentUser";

import { MoreVertical, LogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function SidebarHeader() {
    const { data } = useCurrentUser();

    const router = useRouter();
    const queryClient = useQueryClient();

    if (!data) return null;

    async function handleLogout() {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            queryClient.clear();

            toast.success("Logged out!");

            router.replace("/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to logout");
        }
    }

    return (
        <div className="flex items-center justify-between bg-slate-900/95 px-5 py-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-slate-700/70 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white">
                        {data.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate text-lg font-semibold tracking-tight text-white">
                        {data.user.username}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                        {data.user.email}
                    </p>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-xl p-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white focus:outline-none">
                    <MoreVertical className="h-5 w-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-40 rounded-xl border border-slate-800 bg-slate-900 shadow-xl"
                >
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer rounded-md text-red-400 focus:bg-red-500/10 focus:text-red-400"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}