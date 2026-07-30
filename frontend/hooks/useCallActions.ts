"use client";

import { useSocket } from "./useSocket";
import { useCall } from "./useCall";
import { CallUser, initialCallState } from "@/providers/CallProvider";
import { useWebRTC } from "./useWebRTC";
import { useCurrentUser } from "./useCurrentUser";
import { toast } from "sonner";

interface StartVoiceCallData {
    conversationId: string;
    receiver: CallUser;
}

export function useCallActions() {
    const { socket } = useSocket();
    const { setCallState, timeoutRef } = useCall();

    const { data: currentUser } = useCurrentUser();

    const { closePeerConnection } = useWebRTC();

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

        timeoutRef.current = setTimeout(() => {
            endCall(conversationId);

            toast.info(`No answer from ${receiver.username}`);
        },30000);

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
                    // reset if failed
                    setCallState((prev) => ({
                        ...prev,
                        status: "idle",
                    }));
                }
            }
        );
    }

    function endCall(conversationId: string) {
        socket?.emit("end_call", {
            conversationId,
        });

        closePeerConnection();

        setCallState(initialCallState);
    }

    return {
        startVoiceCall,
        endCall
    };
}