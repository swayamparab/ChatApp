"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useGroupInfo } from "@/hooks/group/useGroupInfo";
import { GroupMember } from "@/types/group";

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

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-slate-800 bg-slate-900 text-white sm:max-w-md">
                {isLoading ? (
                    <p className="py-10 text-center text-slate-400">
                        Loading...
                    </p>
                ) : !data ? (
                    <p className="py-10 text-center text-red-400">
                        Failed to load group.
                    </p>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-sky-600 text-3xl font-bold">
                                        {data.group.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <DialogTitle className="text-2xl">
                                    {data.group.name}
                                </DialogTitle>

                                <p className="text-sm text-slate-400">
                                    {data.group.members.length} members
                                </p>
                            </div>
                        </DialogHeader>

                        <div className="mt-6">
                            <h3 className="mb-3 text-sm font-semibold uppercase text-slate-400">
                                Members
                            </h3>

                            <div className="space-y-3">
                                {data.group.members.map(
                                    (member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Avatar>
                                                <AvatarFallback>
                                                    {member.username
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <p className="font-medium">
                                                    {member.username}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}