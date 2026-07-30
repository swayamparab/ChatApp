"use client";

import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";

export function useWebRTCActions() {
    const { socket } = useSocket();

    const {
        localStream,
        createPeerConnection,
        setupLocalMedia,
        pendingIceCandidates,
        isMuted,
        setIsMuted,
    } = useWebRTC();

    async function createOffer(conversationId: string) {
        if (!socket) return;

        await setupLocalMedia();

        const peer = createPeerConnection();

        peer.onicecandidate = (event) => {
            if (!event.candidate) return;

            socket.emit("ice_candidate", {
                conversationId,
                candidate: event.candidate,
            });
        };

        const offer = await peer.createOffer();

        await peer.setLocalDescription(offer);

        socket.emit("webrtc_offer", {
            conversationId,
            offer,
        });
    }

    async function createAnswer(
        conversationId: string,
        offer: RTCSessionDescriptionInit
    ) {
        if (!socket) return;

        await setupLocalMedia();

        const peer = createPeerConnection();

        peer.onicecandidate = (event) => {
            if (!event.candidate) return;

            socket.emit("ice_candidate", {
                conversationId,
                candidate: event.candidate,
            });
        };

        await peer.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        for (const candidate of pendingIceCandidates.current) {
            await peer.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        }

        pendingIceCandidates.current = [];

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        socket.emit("webrtc_answer", {
            conversationId,
            answer,
        });
    }

    function toggleMute() {
        const audioTrack = localStream?.getAudioTracks()[0];

        if (!audioTrack) return;

        audioTrack.enabled = !audioTrack.enabled;

        setIsMuted(!audioTrack.enabled);
    }

    return {
        createOffer,
        createAnswer,
        toggleMute,
    };
}