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
import { useEffect, useState } from "react";

export function IncomingCallDialog() {
    const { socket } = useSocket();

    const { callState, setCallState, setIsVideoMinimized } = useCall();

    const { stopIncoming } = useRingtone();

    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev === "..." ? "." : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

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
        setIsVideoMinimized(false);
    };

    return (
        <Dialog open>
            <DialogContent className="border-slate-700 bg-slate-900 text-white sm:max-w-sm">
                <div className="flex flex-col items-center py-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />

                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-4xl font-bold text-white shadow-xl">
                            {callState.caller.username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold">
                        {callState.caller.username}
                    </h2>

                    <p className="mt-2 text-muted-foreground text-base">
                        {callState.type === "video"
                            ? `Incoming Video Call${dots}`
                            : `Incoming Voice Call${dots}`}
                    </p>

                    <div className="mt-10 flex gap-8">

                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-16 w-16 rounded-full shadow-lg"
                            onClick={rejectCall}
                        >
                            <PhoneOff className="h-7 w-7" />
                        </Button>

                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                            onClick={acceptCall}
                        >
                            <Phone className="h-7 w-7" />
                        </Button>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}