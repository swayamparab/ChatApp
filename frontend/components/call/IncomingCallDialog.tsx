"use client";

import { Phone, PhoneOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/call/useCall";
import { useSocket } from "@/hooks/useSocket";
import { initialCallState } from "@/providers/CallProvider";
import { useRingtone } from "@/hooks/call/useRingtone";

export function IncomingCallDialog() {
    const { socket } = useSocket();

    const { callState, setCallState } = useCall();

    const { stopIncoming } = useRingtone();

    if (callState.status !== "incoming") {
        return null;
    }

    const acceptCall = () => {

        stopIncoming();

        socket.emit(
            "accept_call",
            {
                conversationId: callState.conversationId,
            },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    return;
                }

                setCallState((prev) => ({
                    ...prev,
                    status: "connecting",
                }));
            }
        );
    };

    const rejectCall = () => {

        stopIncoming();

        socket.emit(
            "reject_call",
            {
                conversationId: callState.conversationId,
            },
            () => { }
        );

        setCallState(initialCallState);
    };

    return (
        <Dialog open>
            <DialogContent className="sm:max-w-sm">
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">
                            Incoming Voice Call
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            {callState.caller.username}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-14 w-14 rounded-full"
                            onClick={rejectCall}
                        >
                            <PhoneOff className="h-6 w-6" />
                        </Button>

                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full"
                            onClick={acceptCall}
                        >
                            <Phone className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}