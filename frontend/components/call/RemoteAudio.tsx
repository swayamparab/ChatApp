"use client";

import { useEffect, useRef } from "react";

import { useWebRTC } from "@/hooks/webrtc/useWebRTC";

export function RemoteAudio() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const { remoteStream } = useWebRTC();

    useEffect(() => {
        if (!audioRef.current || !remoteStream) return;

        audioRef.current.srcObject = remoteStream;

        audioRef.current.play().catch(console.error);
        
    }, [remoteStream]);

    return <audio ref={audioRef} autoPlay playsInline />;
}