"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { X } from "lucide-react";

import { useSearchUsers } from "@/hooks/useSearchUsers";
import { useGroupActions } from "@/hooks/group/useGroupActions";

type CreateGroupDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CreateGroupDialog({
    open,
    onOpenChange,
}: CreateGroupDialogProps) {
    const [groupName, setGroupName] = useState("");

    const [search, setSearch] = useState("");

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const { data: users } = useSearchUsers(search);

    const {
        createGroup,
        isCreatingGroup,
    } = useGroupActions();

    useEffect(() => {
        if (!open) {
            setGroupName("");
            setSearch("");
            setSelectedUsers([]);
        }
    }, [open]);

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
                <DialogHeader className="border-b border-slate-800 px-6 py-5">
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
                    <div className="flex flex-col items-center gap-3">
                        <Avatar className="h-16 w-16 ring-2 ring-slate-700">
                            <AvatarFallback className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-xl font-bold">
                                {groupName
                                    ? groupName.charAt(0).toUpperCase()
                                    : "👥"}
                            </AvatarFallback>
                        </Avatar>

                        <DialogTitle className="text-xl">
                            Create Group
                        </DialogTitle>

                        <input
                            value={groupName}
                            onChange={(e) =>
                                setGroupName(e.target.value)
                            }
                            placeholder="Group name"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-800
                                px-4
                                py-2
                                text-center
                                outline-none
                                focus:border-sky-500
                            "
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4">

                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Selected Members
                    </h3>

                    {selectedUsers.length === 0 ? (
                        <p className="mb-4 text-sm text-slate-500">
                            No members selected.
                        </p>
                    ) : (
                        <div className="mb-5 flex flex-wrap gap-2">
                            {users?.users
                                .filter((user) =>
                                    selectedUsers.includes(user.id)
                                )
                                .map((user) => (
                                    <div
                                        key={user.id}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-slate-800
                                            px-3
                                            py-1
                                            text-sm
                                        "
                                    >
                                        {user.username}

                                        <button
                                            onClick={() =>
                                                setSelectedUsers((prev) =>
                                                    prev.filter(
                                                        (id) =>
                                                            id !==
                                                            user.id
                                                    )
                                                )
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search users..."
                        className="
                            mb-4
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            px-4
                            py-2
                            outline-none
                            focus:border-sky-500
                        "
                    />

                    <div className="space-y-2">
                        {users?.users.map((user) => {
                            const selected =
                                selectedUsers.includes(user.id);

                            return (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedUsers((prev) =>
                                            selected
                                                ? prev.filter(
                                                    (id) =>
                                                        id !==
                                                        user.id
                                                )
                                                : [
                                                    ...prev,
                                                    user.id,
                                                ]
                                        )
                                    }
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
                                                {user.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="text-left">
                                            <p className="font-medium">
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
                                        className="accent-sky-500"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-slate-800 p-5">
                    <button
                        disabled={
                            !groupName.trim() ||
                            selectedUsers.length === 0 ||
                            isCreatingGroup
                        }
                        onClick={() =>
                            createGroup(
                                {
                                    name: groupName.trim(),
                                    memberIds: selectedUsers,
                                },
                                {
                                    onSuccess: () => {
                                        onOpenChange(false);
                                    },
                                }
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            bg-sky-600
                            py-3
                            font-medium
                            text-white
                            transition
                            hover:bg-sky-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {isCreatingGroup
                            ? "Creating..."
                            : "Create Group"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}