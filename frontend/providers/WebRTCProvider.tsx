"use client";

import { RemoteAudio } from "@/components/call/RemoteAudio";
import { WebRTCEvents } from "@/components/providers/WebRTCEvents";
import { createContext, ReactNode, useMemo, useRef, useState } from "react";

interface WebRTCContextType {
    peerConnection: React.MutableRefObject<RTCPeerConnection | null>

    localStream: MediaStream | null;
    setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

    remoteStream: MediaStream | null;
    setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

    createPeerConnection: () => RTCPeerConnection;
    closePeerConnection: () => void;

    getLocalStream: () => Promise<MediaStream>;
    setupLocalMedia: () => Promise<MediaStream>;

    pendingIceCandidates: React.MutableRefObject<RTCIceCandidateInit[]>;
}

export const WebRTCContext = createContext<WebRTCContextType | null>(null);

export function WebRTCProvider({ children }: { children: React.ReactNode }) {

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

    function createPeerConnection() {
        if (peerConnection.current) {
            return peerConnection.current;
        }

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        });

        peer.ontrack = (event) => {
            console.log("Remote stream received");

            setRemoteStream(event.streams[0]);
        };

        peerConnection.current = peer;

        return peer;
    }

    function closePeerConnection() {
        localStream?.getTracks().forEach((track) => {
            track.stop();
        });

        remoteStream?.getTracks().forEach((track) => {
            track.stop();
        });

        setLocalStream(null);
        setRemoteStream(null);

        pendingIceCandidates.current = [];

        peerConnection.current?.close();
        peerConnection.current = null;
    }

    async function getLocalStream() {
        if (localStream) {
            return localStream;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        setLocalStream(stream);

        return stream;
    }

    async function setupLocalMedia() {
        const stream = await getLocalStream();

        const peer = createPeerConnection();

        const senders = peer.getSenders();

        stream.getTracks().forEach(track => {
            const alreadyAdded = senders.some(
                sender => sender.track === track
            );

            if (!alreadyAdded) {
                peer.addTrack(track, stream);
            }
        });

        return stream;
    }

    const value = useMemo(
        () => ({
            peerConnection,

            localStream,
            setLocalStream,

            remoteStream,
            setRemoteStream,

            createPeerConnection,
            closePeerConnection,

            getLocalStream,
            setupLocalMedia,

            pendingIceCandidates,
        }),
        [localStream, remoteStream]
    );

    return (
        <WebRTCContext.Provider value={value}>
            <WebRTCEvents />
            <RemoteAudio />
            {children}
        </WebRTCContext.Provider>
    );
}