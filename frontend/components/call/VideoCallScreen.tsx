"use client";

import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCallActions } from "@/hooks/call/useCallActions";
import { useWebRTCActions } from "@/hooks/webrtc/useWebRTCActions";
import { useWebRTC } from "@/hooks/webrtc/useWebRTC";
import { useCall } from "@/hooks/call/useCall";

import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCallDuration } from "@/hooks/call/useCallDuration";

export function VideoCallScreen() {
    const { callState } = useCall();

    const { data: currentUser } = useCurrentUser();

    const duration = useCallDuration(callState.connectedAt);
    const { endCall } = useCallActions();
    const { toggleMute, toggleCamera } = useWebRTCActions();
    const { isMuted, isCameraOff } = useWebRTC();

    if (!currentUser) return null;

    const remoteUser =
        currentUser.user.id === callState.caller.id
            ? callState.receiver
            : callState.caller;

    if (callState.type !== "video") {
        return null;
    }

    if (
        callState.status !== "connecting" &&
        callState.status !== "connected"
    ) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black">

            <div className="absolute inset-0">
                <RemoteVideo />
            </div>
            <div
                className="
                    absolute
                    top-0
                    left-0
                    right-0
                    flex
                    items-start
                    justify-between
                    bg-gradient-to-b
                    from-black/70
                    to-transparent
                    p-6
                "
            >
                <div>
                    <p className="text-2xl font-semibold text-white">
                        {remoteUser.username}
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                        {callState.status === "connecting"
                            ? "Connecting..."
                            : duration}
                    </p>
                </div>
            </div>
            <div
                className="
                    absolute
                    bottom-6
                    right-6
                    h-52
                    w-36
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-700
                    shadow-2xl
                "
            >
                <LocalVideo />
            </div>
            <div
                className="
                    absolute
                    bottom-8
                    left-1/2
                    z-20
                    flex
                    -translate-x-1/2
                    items-center
                    gap-4
                    rounded-full
                    bg-black/55
                    px-5
                    py-3
                    backdrop-blur-2xl
                    border
                    border-white/10
                    shadow-2xl
                "
            >
                <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full transition-colors ${isMuted
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                        }`}
                    onClick={toggleMute}
                >
                    {isMuted ? (
                        <MicOff className="h-5 w-5" />
                    ) : (
                        <Mic className="h-5 w-5" />
                    )}
                </Button>
                <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full transition-colors ${isCameraOff
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                        }`}
                    onClick={toggleCamera}
                >
                    {isCameraOff ? (
                        <VideoOff className="h-5 w-5" />
                    ) : (
                        <Video className="h-5 w-5" />
                    )}
                </Button>

                <Button
                    size="icon"
                    variant="destructive"
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