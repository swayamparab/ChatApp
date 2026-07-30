"use client";

import { useEffect } from "react";

import { useSocket } from "@/hooks/useSocket";
import { useWebRTCActions } from "./useWebRTCActions";
import { useWebRTC } from "./useWebRTC";

export function useWebRTCEvents() {
    const { socket } = useSocket();

    const { createAnswer } = useWebRTCActions();
    const { createPeerConnection, pendingIceCandidates } = useWebRTC();

    useEffect(() => {
        if (!socket) return;

        socket.on("webrtc_offer", async ({ conversationId, offer }) => {

            await createAnswer(conversationId, offer);
        });

        socket.on("webrtc_answer", async ({ answer }) => {

            const peer = createPeerConnection();

            await peer.setRemoteDescription(new RTCSessionDescription(answer));

            for (const candidate of pendingIceCandidates.current) {
                await peer.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            }

            pendingIceCandidates.current = [];

            console.log("WebRTC connection negotiated");
        });

        socket.on("ice_candidate", async ({ candidate }) => {
            const peer = createPeerConnection();

            if (!peer.remoteDescription) {
                pendingIceCandidates.current.push(candidate);
                return;
            }

            try {
                await peer.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );

                console.log("ICE added");
            } catch (error) {
                console.error("Failed to add ICE candidate", error);
            }
        });

        return () => {
            socket.off("webrtc_offer");
            socket.off("webrtc_answer");
            socket.off("ice_candidate");
        };
    }, [
        socket,
        createAnswer,
        createPeerConnection,
        pendingIceCandidates
    ]);
}