"use client";

import {
    createContext,
    useMemo,
    useState,
} from "react";

import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";
import { CallingDialog } from "@/components/call/CallingDialog";

export type CallType = "voice" | "video";

export type CallStatus =
    | "idle"
    | "calling"
    | "incoming"
    | "connecting"
    | "connected";

export interface CallUser {
    id: string;
    username: string;
}

export interface CallData {
    conversationId: string;
    type: CallType;
    caller: CallUser;
    receiver: CallUser;
}

export interface CallState extends CallData {
    status: CallStatus;
    connectedAt: number | null;
}

interface CallContextType {
    callState: CallState;
    setCallState: React.Dispatch<
        React.SetStateAction<CallState>
    >;
}

export const CallContext =
    createContext<CallContextType | null>(null);

export const initialCallState: CallState = {
    status: "idle",
    conversationId: "",
    type: "voice",
    caller: {
        id: "",
        username: "",
    },
    receiver: {
        id: "",
        username: ""
    },
    connectedAt: null,
};

export function CallProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [callState, setCallState] = useState(initialCallState);

    const value = useMemo(
        () => ({
            callState,
            setCallState,
        }),
        [callState]
    );

    return (
        <CallContext.Provider value={value}>
            {children}

            <IncomingCallDialog />
            <CallingDialog />
        </CallContext.Provider>
    );
}