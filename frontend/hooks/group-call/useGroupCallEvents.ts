"use client";

import { useEffect } from "react";

import { useSocket } from "@/hooks/useSocket";

type Props = {
    onUserJoined: (data: {
        userId: string;
    }) => void;

    onUserLeft: (data: {
        userId: string;
    }) => void;

    onCallEnded: () => void;
};

export function useGroupCallEvents({
    onUserJoined,
    onUserLeft,
    onCallEnded,
}: Props) {
    const { socket } = useSocket();

    useEffect(() => {
        socket.on(
            "group_call:user_joined",
            onUserJoined
        );

        socket.on(
            "group_call:user_left",
            onUserLeft
        );

        socket.on(
            "group_call:ended",
            onCallEnded
        );

        return () => {
            socket.off(
                "group_call:user_joined",
                onUserJoined
            );

            socket.off(
                "group_call:user_left",
                onUserLeft
            );

            socket.off(
                "group_call:ended",
                onCallEnded
            );
        };
    }, [
        socket,
        onUserJoined,
        onUserLeft,
        onCallEnded,
    ]);
}