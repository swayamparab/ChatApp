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
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { toast } from "sonner";

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
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {
        leaveGroup,
        isLeaving,

        deleteGroup,
        isDeletingGroup,

        updateGroup,
        isUpdating,

        addMembers,
        isAddingMembers,
    } = useGroupActions();

    const [editingName, setEditingName] = useState(false);

    const [groupName, setGroupName] = useState("");

    const [addingMembers, setAddingMembers] = useState(false);

    const [search, setSearch] = useState("");

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const { data: users } = useSearchUsers(search);

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

    const availableUsers =
        users?.users.filter(
            (user) =>
                !members.some(
                    (member) => member.id === user.id
                )
        ) ?? [];

    const isOwner = data.group.createdBy === currentUser.user.id;

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
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="
                            absolute
                            left-4
                            top-4
                            rounded-full
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>
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
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Members
                        </h3>

                        <button
                            onClick={() => setAddingMembers(true)}
                            className="
                                rounded-lg
                                bg-sky-600
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-sky-700
                            "
                        >
                            + Add
                        </button>
                    </div>

                    {!addingMembers ? (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <GroupMemberItem
                                    key={member.id}
                                    member={member}
                                    currentUserId={currentUser.user.id}
                                    currentUserRole={
                                        data.group.members.find(
                                            (m) => m.id === currentUser.user.id
                                        )!.role
                                    }
                                    groupOwnerId={data.group.createdBy}
                                    groupId={groupId}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="
                                    mb-4
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-700
                                    bg-slate-800
                                    px-3
                                    py-2
                                    outline-none
                                    focus:border-sky-500
                                "
                            />

                            <div className="space-y-2">
                                {availableUsers.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-slate-400">
                                        No users found.
                                    </p>
                                ) : (
                                    availableUsers.map((user) => {
                                        const selected = selectedMembers.includes(user.id);

                                        return (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedMembers((prev) =>
                                                        selected
                                                            ? prev.filter((id) => id !== user.id)
                                                            : [...prev, user.id]
                                                    );
                                                }}
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    rounded-xl
                                                    px-3
                                                    py-2
                                                    transition
                                                    hover:bg-slate-800
                                                "
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback>
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="text-left">
                                                        <p className="font-medium text-white">
                                                            {user.username}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    readOnly
                                                    className="h-4 w-4 accent-sky-500"
                                                />
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        setAddingMembers(false);
                                        setSearch("");
                                        setSelectedMembers([]);
                                    }}
                                    className="
                                        flex-1
                                        rounded-lg
                                        border
                                        border-slate-700
                                        py-2
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={
                                        selectedMembers.length === 0 ||
                                        isAddingMembers
                                    }
                                    onClick={async () => {
                                        try {
                                            await addMembers({
                                                groupId,
                                                memberIds: selectedMembers,
                                            });

                                            setAddingMembers(false);
                                            setSelectedMembers([]);
                                            setSearch("");

                                            toast("member added!")
                                        } catch (error) {
                                            toast.error(error instanceof Error ? error.message : "Failed to add members");
                                        }
                                    }}
                                    className="
                                        flex-1
                                        rounded-lg
                                        bg-sky-600
                                        py-2
                                        disabled:opacity-50
                                    "
                                >
                                    Add ({selectedMembers.length})
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {/* Footer */}
                <div className="border-t border-slate-800 p-4">

                    {isOwner && !confirmLeave && !confirmDelete && (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="
                                mb-3
                                w-full
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                text-red-500
                                transition
                                hover:bg-red-500/10
                            "
                        >
                            Delete Group
                        </button>
                    )}

                    {!confirmLeave && !confirmDelete && (
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
                    )}

                    {confirmLeave && (
                        <div className="space-y-4 rounded-xl border border-red-900/40 bg-red-500/5 p-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-red-400">
                                    Leave Group?
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    You will no longer receive messages from this group.
                                    You'll need to be added again by a member to rejoin.
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

                    {confirmDelete && (
                        <div className="space-y-4 rounded-xl border border-red-900/40 bg-red-500/5 p-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-red-500">
                                    Delete Group?
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    This action is permanent. The group, its messages,
                                    and all history will be deleted for every member.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
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
                                    onClick={() => deleteGroup(groupId)}
                                    disabled={isDeletingGroup}
                                    className="
                                        flex-1
                                        rounded-lg
                                        bg-red-700
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-red-800
                                        disabled:opacity-60
                                    "
                                >
                                    {isDeletingGroup
                                        ? "Deleting..."
                                        : "Delete Group"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
}