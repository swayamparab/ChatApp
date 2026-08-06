"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { api } from "@/lib/api";

import CreateGroupDialog from "../group/CreateGroupDialog";
import SettingsDialog from "@/components/user/SettingsDialog";

import {
    LogOut,
    MoreVertical,
    Settings,
    UsersRound,
} from "lucide-react";

export default function SidebarHeader() {
    const { data } = useCurrentUser();

    const router = useRouter();
    const queryClient = useQueryClient();

    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    if (!data) return null;

    async function handleLogout() {
        try {
            await api.post("/auth/logout");

            queryClient.clear();

            toast.success("Logged out!");

            router.replace("/login");
        } catch (error) {
            console.error(error);

            toast.error("Failed to logout");
        }
    }

    return (
        <>
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-slate-700/70 shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 font-semibold text-white">
                            {data.user.username
                                .charAt(0)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-white">
                            {data.user.username}
                        </p>

                        <p className="truncate text-sm text-slate-400">
                            {data.user.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            setCreateGroupOpen(true)
                        }
                        className="text-slate-400 hover:bg-slate-800 hover:text-white"
                        aria-label="Create Group"
                    >
                        <UsersRound className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:bg-slate-800 hover:text-white"
                                aria-label="More options"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-44 border-slate-800 bg-slate-900"
                        >
                            <DropdownMenuItem
                                onClick={() => setSettingsOpen(true)}
                                className="cursor-pointer text-white focus:bg-slate-800 focus:text-white"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <CreateGroupDialog
                open={createGroupOpen}
                onOpenChange={setCreateGroupOpen}
            />

            <SettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
            />
        </>
    );
}