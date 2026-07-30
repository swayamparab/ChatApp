"use client";

import { useEffect } from "react";

import {
    CallData,
    initialCallState,
} from "@/providers/CallProvider";

import { useCall } from "./useCall";
import { useSocket } from "./useSocket";
import { useWebRTCActions } from "./useWebRTCActions";
import { useWebRTC } from "./useWebRTC";

export function useCallEvents() {
    const { socket } = useSocket();
    const { setCallState } = useCall();

    const { createOffer } = useWebRTCActions();

    const { closePeerConnection } = useWebRTC();

    useEffect(() => {
        function handleIncomingCall(data: CallData) {
            setCallState({
                ...data,
                status: "incoming",
                connectedAt: null,
            });
        }

        async function handleCallAccepted(data: {
            conversationId: string;
        }) {
            setCallState((prev) => ({
                ...prev,
                status: "connecting",
            }));

            await createOffer(data.conversationId);
        }

        function handleCallRejected() {
            setCallState(initialCallState);
        }

        function handleCallEnded() {
            closePeerConnection();

            setCallState(initialCallState);
        }

        socket.off("incoming_call", handleIncomingCall);
        socket.off("call_accepted", handleCallAccepted);
        socket.off("call_rejected", handleCallRejected);
        socket.off("end_call", handleCallEnded);

        socket.on("incoming_call", handleIncomingCall);
        socket.on("call_accepted", handleCallAccepted);
        socket.on("call_rejected", handleCallRejected);
        socket.on("end_call", handleCallEnded);

        return () => {
            socket.off("incoming_call", handleIncomingCall);
            socket.off("call_accepted", handleCallAccepted);
            socket.off("call_rejected", handleCallRejected);
            socket.off("end_call", handleCallEnded);
        };
    }, [socket, setCallState, createOffer]);
}