"use client";

import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/call/useCall";
import { useCallActions } from "@/hooks/call/useCallActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCallDuration } from "@/hooks/call/useCallDuration";
import { useWebRTCActions } from "@/hooks/webrtc/useWebRTCActions";
import { useWebRTC } from "@/hooks/webrtc/useWebRTC";

export default function OngoingCallCard() {
    const { callState } = useCall();

    const { endCall } = useCallActions();

    const { data: currentUser } = useCurrentUser();

    const duration = useCallDuration(callState.connectedAt);

    const { toggleMute } = useWebRTCActions();

    const { isMuted } = useWebRTC();

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
        <div className="mx-3 mb-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="relative">
                        <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                            <Phone className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-white">
                            {remoteUser.username}
                        </p>

                        <p className="text-xs text-slate-400">
                            {callState.status === "connecting"
                                ? "Connecting..."
                                : duration}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-10 w-10 rounded-full transition-all ${isMuted
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-slate-800 hover:bg-slate-700"
                            }`}
                        onClick={toggleMute}
                    >
                        {isMuted ? (
                            <MicOff className="h-4 w-4" />
                        ) : (
                            <Mic className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        size="icon"
                        variant="destructive"
                        className="h-10 w-10 rounded-full"
                        onClick={() =>
                            endCall(callState.conversationId)
                        }
                    >
                        <PhoneOff className="h-4 w-4" />
                    </Button>

                </div>

            </div>
        </div>
    );
}