"use client";

import { useEffect, useRef } from "react";

import { useWebRTC } from "@/hooks/webrtc/useWebRTC";
import { useCall } from "@/hooks/call/useCall";

export function LocalVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const { localStream } = useWebRTC();
    const { callState } = useCall();

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

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
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover rounded-2xl"
        />
    );
}