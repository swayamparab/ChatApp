"use client";

import { useSocket } from "../useSocket";
import { useCall } from "./useCall";
import { CallUser, initialCallState } from "@/providers/CallProvider";
import { useWebRTC } from "../webrtc/useWebRTC";
import { useCurrentUser } from "../useCurrentUser";
import { toast } from "sonner";
import { useRingtone } from "./useRingtone";

interface StartVoiceCallData {
    conversationId: string;
    receiver: CallUser;
}

export function useCallActions() {
    const { socket } = useSocket();
    const { setCallState, timeoutRef } = useCall();

    const { data: currentUser } = useCurrentUser();

    const { closePeerConnection } = useWebRTC();

    const { playOutgoing, stopOutgoing, stopIncoming } = useRingtone();

    function startVoiceCall({ conversationId, receiver }: StartVoiceCallData) {
        if (!currentUser) return;

        setCallState({
            status: "calling",
            conversationId,
            type: "voice",
            caller: {
                id: currentUser.user.id,
                username: currentUser.user.username,
            },
            receiver,
            connectedAt: null,
        });

        playOutgoing();

        timeoutRef.current = setTimeout(() => {
            endCall(conversationId);

            toast.info(`No answer from ${receiver.username}`);
        }, 30000);

        socket.emit(
            "call_user",
            {
                conversationId,
                type: "voice",
                receiver
            },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    stopOutgoing();

                    toast.error(response.message);

                    // reset if failed
                    setCallState(initialCallState);
                }
            }
        );
    }

    function startVideoCall({ conversationId, receiver }: StartVoiceCallData) {
        if (!currentUser) return;

        setCallState({
            status: "calling",
            conversationId,
            type: "video",
            caller: {
                id: currentUser.user.id,
                username: currentUser.user.username,
            },
            receiver,
            connectedAt: null,
        });

        playOutgoing();

        timeoutRef.current = setTimeout(() => {
            endCall(conversationId);

            toast.info(`No answer from ${receiver.username}`);
        }, 30000);

        socket.emit(
            "call_user",
            {
                conversationId,
                type: "video",
                receiver
            },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    stopOutgoing();

                    toast.error(response.message);

                    // reset if failed
                    setCallState(initialCallState);
                }
            }
        );
    }

    function endCall(conversationId: string) {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        socket?.emit("end_call", {
            conversationId,
        });

        stopIncoming();
        stopOutgoing();

        closePeerConnection();

        setCallState(initialCallState);
    }

    return {
        startVoiceCall,
        startVideoCall,
        endCall,
    };
}