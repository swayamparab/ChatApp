"use client";

import { PhoneOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/useCall";
import { useSocket } from "@/hooks/useSocket";
import { initialCallState } from "@/providers/CallProvider";

export function CallingDialog() {
    const { socket } = useSocket();

    const { callState, setCallState } = useCall();

    if (callState.status !== "calling") {
        return null;
    }

    function cancelCall() {
        socket.emit(
            "reject_call",
            {
                conversationId:
                    callState.conversationId,
            },
            () => { }
        );

        setCallState(initialCallState);
    }

    return (
        <Dialog open>
            <DialogContent className="sm:max-w-sm">
                <div className="flex flex-col items-center gap-6 py-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">
                            Calling...
                        </h2>

                        <p className="mt-2 text-muted-foreground">
                            {callState.receiver.username}
                        </p>
                    </div>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        onClick={cancelCall}
                    >
                        <PhoneOff className="h-6 w-6" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}