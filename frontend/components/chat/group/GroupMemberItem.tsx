"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { GroupMember } from "@/types/group";

type Props = {
    member: GroupMember;
    currentUserId: string;
};

export default function GroupMemberItem({
    member,
    currentUserId,
}: Props) {
    const isYou = member.id === currentUserId;

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

            {member.role === "admin" && (
                <Badge className="bg-sky-600">
                    Admin
                </Badge>
            )}
        </div>
    );
}