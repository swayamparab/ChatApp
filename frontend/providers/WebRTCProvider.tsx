"use client";

import { LocalVideo } from "@/components/call/LocalVideo";
import { RemoteAudio } from "@/components/call/RemoteAudio";
import { RemoteVideo } from "@/components/call/RemoteVideo";
import { createContext, useMemo, useRef, useState } from "react";

interface WebRTCContextType {
    peerConnection: React.MutableRefObject<RTCPeerConnection | null>

    localStream: MediaStream | null;
    setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

    remoteStream: MediaStream | null;
    setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;

    createPeerConnection: () => RTCPeerConnection;
    closePeerConnection: () => void;

    getLocalStream: (options: SetupLocalMediaOptions) => Promise<MediaStream>;
    setupLocalMedia: (options: SetupLocalMediaOptions) => Promise<MediaStream>;

    connectionState: RTCPeerConnectionState;

    pendingIceCandidates: React.MutableRefObject<RTCIceCandidateInit[]>;

    isMuted: boolean;
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;

    isCameraOff: boolean;
    setIsCameraOff: React.Dispatch<React.SetStateAction<boolean>>;

    remoteCameraOff: boolean;
    setRemoteCameraOff: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SetupLocalMediaOptions {
    audio: boolean;
    video: boolean;
}

export const WebRTCContext = createContext<WebRTCContextType | null>(null);

export function WebRTCProvider({ children }: { children: React.ReactNode }) {

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");

    const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const [remoteCameraOff, setRemoteCameraOff] = useState(false);

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

        peer.onconnectionstatechange = () => {
            console.log("Connection State:", peer.connectionState);

            setConnectionState(peer.connectionState);
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

        setConnectionState("closed");

        setIsMuted(false);
        setIsCameraOff(false);

        setRemoteCameraOff(false);
    }

    async function getLocalStream(options: SetupLocalMediaOptions) {
        if (localStream) {
            return localStream;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: options.audio,
            video: options.video,
        });

        setLocalStream(stream);

        return stream;
    }

    async function setupLocalMedia(options: SetupLocalMediaOptions) {
        const stream = await getLocalStream(options);

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

            connectionState,

            pendingIceCandidates,

            isMuted,
            setIsMuted,

            isCameraOff,
            setIsCameraOff,

            remoteCameraOff,
            setRemoteCameraOff,
        }),
        [localStream, remoteStream, connectionState, isMuted, isCameraOff, remoteCameraOff]
    );

    return (
        <WebRTCContext.Provider value={value}>
            {children}
        </WebRTCContext.Provider>
    );
}