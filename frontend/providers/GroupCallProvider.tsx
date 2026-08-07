"use client";

import {
    createContext,
    useCallback,
    useState,
} from "react";

import { toast } from "sonner";

import { useSocket } from "@/hooks/useSocket";
import { useGroupCallEvents } from "@/hooks/group-call/useGroupCallEvents";

type CallType = "voice" | "video";

type GroupCallContextType = {
    inCall: boolean;
    conversationId: string | null;
    callType: CallType | null;
    participants: string[];

    startCall: (
        conversationId: string,
        type: CallType
    ) => void;

    joinCall: (
        conversationId: string
    ) => void;

    leaveCall: () => void;
};

export const GroupCallContext =
    createContext<GroupCallContextType | null>(null);

export function GroupCallProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { socket } = useSocket();

    const [inCall, setInCall] =
        useState(false);

    const [
        conversationId,
        setConversationId,
    ] = useState<string | null>(null);

    const [callType, setCallType] =
        useState<CallType | null>(null);

    const [participants, setParticipants] =
        useState<string[]>([]);

    const leaveCall = useCallback(() => {
        if (conversationId) {
            socket.emit("group_call:leave", {
                conversationId,
            });
        }

        setConversationId(null);
        setCallType(null);
        setParticipants([]);
        setInCall(false);
    }, [conversationId, socket]);

    const onUserJoined = useCallback(
        ({
            userId,
        }: {
            userId: string;
        }) => {
            setParticipants((prev) => {
                if (prev.includes(userId)) {
                    return prev;
                }

                return [...prev, userId];
            });
        },
        []
    );

    const onUserLeft = useCallback(
        ({
            userId,
        }: {
            userId: string;
        }) => {
            setParticipants((prev) =>
                prev.filter(
                    (id) => id !== userId
                )
            );
        },
        []
    );

    const onCallEnded = useCallback(() => {
        leaveCall();
    }, [leaveCall]);

    useGroupCallEvents({
        onUserJoined,
        onUserLeft,
        onCallEnded,
    });

    const startCall = useCallback(
        (
            conversationId: string,
            type: CallType
        ) => {
            socket.emit(
                "group_call:start",
                {
                    conversationId,
                },
                (response: {
                    success: boolean;
                    message?: string;
                    participants?: string[];
                }) => {
                    if (!response.success) {
                        toast.error(
                            response.message ??
                            "Failed to start group call."
                        );

                        return;
                    }

                    setConversationId(
                        conversationId
                    );

                    setCallType(type);

                    setParticipants(
                        response.participants ??
                        []
                    );

                    setInCall(true);
                }
            );
        },
        [socket]
    );

    const joinCall = useCallback(
        (conversationId: string) => {
            socket.emit(
                "group_call:join",
                {
                    conversationId,
                },
                (response: {
                    success: boolean;
                    message?: string;
                    participants?: string[];
                }) => {
                    if (!response.success) {
                        toast.error(
                            response.message ??
                            "Failed to join group call."
                        );

                        return;
                    }

                    setConversationId(
                        conversationId
                    );

                    setParticipants(
                        response.participants ??
                        []
                    );

                    setInCall(true);
                }
            );
        },
        [socket]
    );

    return (
        <GroupCallContext.Provider
            value={{
                inCall,
                conversationId,
                callType,
                participants,
                startCall,
                joinCall,
                leaveCall,
            }}
        >
            {children}
        </GroupCallContext.Provider>
    );
}