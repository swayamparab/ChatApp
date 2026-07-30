"use client";

import { useSocket } from "./useSocket";
import { useCall } from "./useCall";
import { CallUser, initialCallState } from "@/providers/CallProvider";
import { useWebRTC } from "./useWebRTC";
import { useCurrentUser } from "./useCurrentUser";

interface StartVoiceCallData {
    conversationId: string;
    receiver: CallUser;
}

export function useCallActions() {
    const { socket } = useSocket();
    const { setCallState } = useCall();

    const { data: currentUser } = useCurrentUser();

    const { closePeerConnection } = useWebRTC();

    function startVoiceCall({ conversationId, receiver }: StartVoiceCallData) {

        if(!currentUser) return;

        setCallState({
            status: "calling",
            conversationId,
            type: "voice",
            caller: {
                id: currentUser.user.id,
                username: currentUser.user.username,
            },
            receiver
        });

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