"use client";

import { useEffect } from "react";

import {
    CallData,
    initialCallState,
} from "@/providers/CallProvider";

import { useCall } from "./useCall";
import { useSocket } from "./useSocket";
import { useWebRTCActions } from "./useWebRTCActions";

export function useCallEvents() {
    const { socket } = useSocket();
    const { setCallState } = useCall();

    const { createOffer } = useWebRTCActions();

    useEffect(() => {
        function handleIncomingCall(data: CallData) {
            setCallState({
                ...data,
                status: "incoming",
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

        socket.off("incoming_call", handleIncomingCall);
        socket.off("call_accepted", handleCallAccepted);
        socket.off("call_rejected", handleCallRejected);

        socket.on("incoming_call", handleIncomingCall);
        socket.on("call_accepted", handleCallAccepted);
        socket.on("call_rejected", handleCallRejected);

        return () => {
            socket.off("incoming_call", handleIncomingCall);
            socket.off("call_accepted", handleCallAccepted);
            socket.off("call_rejected", handleCallRejected);
        };
    }, [socket, setCallState, createOffer]);
}