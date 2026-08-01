"use client";

import { PhoneOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/call/useCall";
import { useSocket } from "@/hooks/useSocket";
import { initialCallState } from "@/providers/CallProvider";
import { useRingtone } from "@/hooks/call/useRingtone";
import { useEffect, useState } from "react";

export function CallingDialog() {
    const { socket } = useSocket();

    const { callState, setCallState, setIsVideoMinimized } = useCall();

    const { stopOutgoing } = useRingtone();

    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev === "..." ? "." : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    if (callState.status !== "calling") {
        return null;
    }

    function cancelCall() {

        stopOutgoing();

        socket.emit(
            "reject_call",
            {
                conversationId:
                    callState.conversationId,
            },
            () => { }
        );

        setCallState(initialCallState);
        setIsVideoMinimized(false);
    }

    return (
        <Dialog open>
            <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-sm">
                <div className="flex flex-col items-center py-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />

                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-4xl font-bold text-white shadow-xl">
                            {callState.receiver.username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold">
                        {callState.receiver.username}
                    </h2>

                    <p className="mt-2 text-muted-foreground animate-pulse text-base">
                        {callState.type === "video"
                            ? `Video Calling${dots}`
                            : `Voice Calling ${dots}`
                        }
                    </p>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="mt-10 h-16 w-16 rounded-full shadow-lg"
                        onClick={cancelCall}
                    >
                        <PhoneOff className="h-7 w-7" />
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}