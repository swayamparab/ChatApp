"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Props = {
    username: string;
    email: string;
};

export default function OutgoingRequestCard({
    username,
    email,
}: Props) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 py-3">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-medium">
                        {username}
                    </p>

                    <p className="text-sm text-slate-400">
                        {email}
                    </p>
                </div>
            </div>

            <Button
                size="sm"
                variant="secondary"
                disabled
            >
                Pending
            </Button>
        </div>
    );
}