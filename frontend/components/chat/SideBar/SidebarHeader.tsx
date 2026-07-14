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

            toast.success("Logged out!")

            router.replace("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border border-slate-700">
                    <AvatarFallback className="bg-blue-600 text-white">
                        {data.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                        {data.user.username}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                        {data.user.email}
                    </p>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-lg p-2 transition hover:bg-slate-800">
                    <MoreVertical className="h-5 w-5 text-slate-400" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500 focus:text-red-500"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}