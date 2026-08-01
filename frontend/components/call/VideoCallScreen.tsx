"use client";

import {
    Mic,
    MicOff,
    PhoneOff,
    Video,
    VideoOff,
    Minimize2,
    RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCall } from "@/hooks/call/useCall";
import { useCallActions } from "@/hooks/call/useCallActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCallDuration } from "@/hooks/call/useCallDuration";
import { useWebRTC } from "@/hooks/webrtc/useWebRTC";
import { useWebRTCActions } from "@/hooks/webrtc/useWebRTCActions";

import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { FloatingVideoCall } from "./FloatingVideoCall";

export function VideoCallScreen() {
    const {
        callState,
        isVideoMinimized,
        setIsVideoMinimized,
    } = useCall();

    const { data: currentUser } = useCurrentUser();

    const duration = useCallDuration(callState.connectedAt);

    const { endCall } = useCallActions();

    const { toggleMute, toggleCamera, switchCamera } = useWebRTCActions();

    const { isMuted, isCameraOff } = useWebRTC();

    if (!currentUser) return null;

    if (callState.type !== "video") return null;

    if (
        callState.status !== "connecting" &&
        callState.status !== "connected"
    ) {
        return null;
    }

    if (isVideoMinimized) {
        return <FloatingVideoCall />;
    }

    const remoteUser =
        currentUser.user.id === callState.caller.id
            ? callState.receiver
            : callState.caller;

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            <div className="absolute inset-0">
                <RemoteVideo />
            </div>

            {/* Top */}
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

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoMinimized(true);
                    }}
                    className="
                        rounded-full
                        bg-black/40
                        p-3
                        text-white
                        transition
                        hover:bg-black/60
                    "
                >
                    <Minimize2 className="h-5 w-5" />
                </button>
            </div>

            {/* Local Preview */}
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

            {/* Controls */}
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
                    border
                    border-white/10
                    bg-black/55
                    px-5
                    py-3
                    shadow-2xl
                    backdrop-blur-2xl
                "
            >
                <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full ${isMuted
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : ""
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
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
                    className={`rounded-full ${isCameraOff
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : ""
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCamera();
                    }}
                >
                    {isCameraOff ? (
                        <VideoOff className="h-5 w-5" />
                    ) : (
                        <Video className="h-5 w-5" />
                    )}
                </Button>
                {typeof navigator !== "undefined" &&
                    navigator.userAgent.includes("Mobile") && (
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                switchCamera();
                            }}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    )
                }
                <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        endCall(callState.conversationId);
                    }}
                >
                    <PhoneOff className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}