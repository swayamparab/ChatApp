"use client";

import { useContext } from "react";
import { CallContext } from "@/providers/CallProvider";

export function useCall() {
    const context = useContext(CallContext);

    if (!context) {
        throw new Error(
            "useCall must be used within CallProvider"
        );
    }

    return context;
}