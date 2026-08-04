"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Check, X } from "lucide-react";

import { useGroupInfo } from "@/hooks/group/useGroupInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import GroupMemberItem from "./GroupMemberItem";
import { useEffect, useState } from "react";
import { useGroupActions } from "@/hooks/group/useGroupActions";

type GroupInfoDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: string;
};

export default function GroupInfoDialog({
    open,
    onOpenChange,
    groupId,
}: GroupInfoDialogProps) {

    const {
        data,
        isLoading,
    } = useGroupInfo(groupId);

    const { data: currentUser } = useCurrentUser();

    const [confirmLeave, setConfirmLeave] = useState(false);

    const {
        leaveGroup,
        isLeaving,

        updateGroup,
        isUpdating,
    } = useGroupActions();

    const [editingName, setEditingName] = useState(false);

    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        if (data) {
            setGroupName(data.group.name);
        }
    }, [data]);

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
                    <p className="py-10 text-center text-slate-400">
                        Loading...
                    </p>
                </DialogContent>
            </Dialog>
        );
    }

    if (!data || !currentUser) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
                    <p className="py-10 text-center text-red-400">
                        Failed to load group.
                    </p>
                </DialogContent>
            </Dialog>
        );
    }

    const members = [...data.group.members].sort((a, b) => {
        const aYou = a.id === currentUser.user.id;
        const bYou = b.id === currentUser.user.id;

        if (aYou) return -1;
        if (bYou) return 1;

        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;

        return a.username.localeCompare(b.username);
    });

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="
                    flex
                    h-[80vh]
                    max-h-[80vh]
                    flex-col
                    overflow-hidden
                    border-slate-800
                    bg-slate-900
                    p-0
                    text-white
                    sm:max-w-md
                "
            >
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-slate-800 px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-16 w-16 ring-2 ring-slate-700 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-xl font-bold text-white">
                                {data.group.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-2">
                            {editingName ? (
                                <input
                                    autoFocus
                                    value={groupName}
                                    onChange={(e) =>
                                        setGroupName(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const newName = groupName.trim();

                                            if (!newName || newName === data.group.name) {
                                                setEditingName(false);
                                                return;
                                            }

                                            updateGroup({
                                                groupId,
                                                name: newName,
                                            });

                                            setEditingName(false);
                                        }

                                        if (e.key === "Escape") {
                                            setGroupName(data.group.name);
                                            setEditingName(false);
                                        }
                                    }}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        px-3
                                        py-1
                                        text-center
                                        text-lg
                                        font-semibold
                                        outline-none
                                        focus:border-sky-500
                                    "
                                />
                            ) : (
                                <DialogTitle className="text-center text-xl font-bold">
                                    {groupName}
                                </DialogTitle>
                            )}

                            {!editingName ? (
                                <button
                                    onClick={() => setEditingName(true)}
                                    className="
                                        rounded-lg
                                        p-1.5
                                        text-slate-400
                                        transition
                                        hover:bg-slate-800
                                        hover:text-white
                                    "
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            ) : (
                                <div className="flex gap-1">
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => {
                                            updateGroup({
                                                groupId,
                                                name: groupName.trim(),
                                            });

                                            setEditingName(false);
                                        }}
                                        className="
                                            rounded-lg
                                            p-1.5
                                            text-emerald-400
                                            hover:bg-slate-800
                                        "
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>

                                    <button
                                        disabled={isUpdating}
                                        onClick={() => {
                                            setGroupName(data.group.name);
                                            setEditingName(false);
                                        }}
                                        className="
                                            rounded-lg
                                            p-1.5
                                            text-red-400
                                            hover:bg-slate-800
                                        "
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-slate-400">
                            {data.group.members.length} members
                        </p>
                    </div>
                </DialogHeader>

                {/* Members */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Members
                    </h3>

                    <div className="space-y-2">
                        {members.map((member) => (
                            <GroupMemberItem
                                key={member.id}
                                member={member}
                                currentUserId={currentUser.user.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800 p-4">
                    {!confirmLeave ? (
                        <button
                            onClick={() => setConfirmLeave(true)}
                            className="
                                w-full
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                text-red-400
                                transition
                                hover:bg-red-500/10
                            "
                        >
                            Leave Group
                        </button>
                    ) : (
                        <div className="space-y-4 rounded-xl border border-red-900/40 bg-red-500/5 p-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-red-400">
                                    Leave Group?
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    You will no longer receive messages from this
                                    group. You'll need to be added again by a member
                                    if you wish to rejoin.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmLeave(false)}
                                    className="
                                        flex-1
                                        rounded-lg
                                        border
                                        border-slate-700
                                        bg-slate-800
                                        py-2
                                        text-sm
                                        transition
                                        hover:bg-slate-700
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => leaveGroup(groupId)}
                                    disabled={isLeaving}
                                    className="
                                        flex-1
                                        rounded-lg
                                        bg-red-600
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-red-700
                                        disabled:opacity-60
                                    "
                                >
                                    {isLeaving
                                        ? "Leaving..."
                                        : "Leave Group"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}