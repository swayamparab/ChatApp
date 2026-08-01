"use client";

import { useEffect } from "react";

import { useSocket } from "@/hooks/useSocket";
import { useWebRTCActions } from "./useWebRTCActions";
import { useWebRTC } from "./useWebRTC";
import { useCall } from "../call/useCall";

export function useWebRTCEvents() {
    const { socket } = useSocket();

    const { createAnswer } = useWebRTCActions();

    const {
        createPeerConnection,
        pendingIceCandidates,
        connectionState,
        setRemoteCameraOff,
    } = useWebRTC();

    const { setCallState } = useCall();

    useEffect(() => {
        if (connectionState === "connected") {
            setCallState((prev) => ({
                ...prev,
                status: "connected",
                connectedAt: Date.now(),
            }));
        }
    }, [connectionState, setCallState]);

    useEffect(() => {
        if (!socket) return;

        async function handleOffer({
            conversationId,
            offer,
        }: {
            conversationId: string;
            offer: RTCSessionDescriptionInit;
        }) {
            await createAnswer(conversationId, offer);
        }

        async function handleAnswer({
            answer,
        }: {
            answer: RTCSessionDescriptionInit;
        }) {
            const peer = createPeerConnection();

            await peer.setRemoteDescription(
                new RTCSessionDescription(answer)
            );

            for (const candidate of pendingIceCandidates.current) {
                await peer.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            }

            pendingIceCandidates.current = [];

            console.log("WebRTC connection negotiated");
        }

        async function handleIceCandidate({
            candidate,
        }: {
            candidate: RTCIceCandidateInit;
        }) {
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
                console.error(
                    "Failed to add ICE candidate",
                    error
                );
            }
        }

        function handleCameraToggle({
            enabled,
        }: {
            enabled: boolean;
        }) {
            setRemoteCameraOff(!enabled);
        }

        socket.off("webrtc_offer", handleOffer);
        socket.off("webrtc_answer", handleAnswer);
        socket.off("ice_candidate", handleIceCandidate);
        socket.off("camera_toggle", handleCameraToggle);

        socket.on("webrtc_offer", handleOffer);
        socket.on("webrtc_answer", handleAnswer);
        socket.on("ice_candidate", handleIceCandidate);
        socket.on("camera_toggle", handleCameraToggle);

        return () => {
            socket.off("webrtc_offer", handleOffer);
            socket.off("webrtc_answer", handleAnswer);
            socket.off("ice_candidate", handleIceCandidate);
            socket.off("camera_toggle", handleCameraToggle);
        };
    }, [
        socket,
        createAnswer,
        createPeerConnection,
        pendingIceCandidates,
        setRemoteCameraOff,
    ]);
}