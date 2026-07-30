"use client";

import { Phone, PhoneOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/useCall";
import { useCallActions } from "@/hooks/useCallActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCallDuration } from "@/hooks/useCallDuration";

export default function OngoingCallCard() {
    const { callState } = useCall();

    const { endCall } = useCallActions();

    const { data: currentUser } = useCurrentUser();

    const duration = useCallDuration(callState.connectedAt);

    if (
        callState.status !== "connecting" &&
        callState.status !== "connected"
    ) {
        return null;
    }

    if (!currentUser) {
        return null;
    }

    const remoteUser =
        currentUser.user.id === callState.caller.id
            ? callState.receiver
            : callState.caller;

    return (
        <div className="mx-3 mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/20 p-2">
                        <Phone className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                        <p className="font-medium text-white">
                            {remoteUser.username}
                        </p>

                        <p className="text-sm text-emerald-300">
                            {callState.status === "connecting"
                                ? "Connecting..."
                                : duration}
                        </p>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                        endCall(callState.conversationId)
                    }
                >
                    <PhoneOff className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}