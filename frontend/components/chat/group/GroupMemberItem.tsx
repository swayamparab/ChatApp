"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { GroupMember } from "@/types/group";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";

import { useGroupActions } from "@/hooks/group/useGroupActions";

type Props = {
    member: GroupMember;
    currentUserId: string;

    currentUserRole: "admin" | "member";
    groupOwnerId: string;
    groupId: string;
};

export default function GroupMemberItem({
    member,
    currentUserId,
    currentUserRole,
    groupOwnerId,
    groupId
}: Props) {

    const {
        removeMember,
        promoteMember,
        demoteAdmin,
        isRemovingMember,
        isPromotingMember,
        isDemotingAdmin,
    } = useGroupActions();

    const isYou = member.id === currentUserId;

    const isOwner = member.id === groupOwnerId;

    const canManage =
        currentUserRole === "admin" &&
        !isYou &&
        !isOwner;

    return (
        <div className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-800/60">
            <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                    <AvatarFallback>
                        {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                            {member.username}
                        </p>

                        {isYou && (
                            <Badge
                                variant="secondary"
                                className="rounded-full bg-slate-700 px-3"
                            >
                                You
                            </Badge>
                        )}
                    </div>

                    <p className="text-xs text-slate-400">
                        {member.email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {member.role === "admin" && (
                    <Badge className="bg-sky-600">
                        Admin
                    </Badge>
                )}

                {canManage && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-lg p-1 hover:bg-slate-700">
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="border-slate-700 bg-slate-900 text-white"
                        >
                            {member.role === "member" ? (
                                <DropdownMenuItem
                                    onClick={() =>
                                        promoteMember({
                                            groupId,
                                            memberId: member.id,
                                        })
                                    }
                                    disabled={isPromotingMember}
                                >
                                    Promote to Admin
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={() =>
                                        demoteAdmin({
                                            groupId,
                                            memberId: member.id,
                                        })
                                    }
                                    disabled={isDemotingAdmin}
                                >
                                    Demote Admin
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                                onClick={() =>
                                    removeMember({
                                        groupId,
                                        memberId: member.id,
                                    })
                                }
                                disabled={isRemovingMember}
                                className="text-red-400"
                            >
                                Remove Member
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}