"use client";

import { useSocket } from "./useSocket";
import { useCall } from "./useCall";
import { CallUser } from "@/providers/CallProvider";

interface StartVoiceCallData {
    conversationId: string;
    receiver: CallUser;
}

export function useCallActions() {
    const { socket } = useSocket();
    const { setCallState } = useCall();

    function startVoiceCall({conversationId, receiver}: StartVoiceCallData) {
        setCallState({
            status: "calling",
            conversationId,
            type: "voice",
            caller: {
                id: "",
                username: "",
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

    return {
        startVoiceCall,
    };
}