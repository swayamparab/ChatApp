"use client";

import { useContext } from "react";

import { GroupCallContext } from "@/providers/GroupCallProvider";

export function useGroupCall() {
    const context = useContext(GroupCallContext);

    if (!context) {
        throw new Error(
            "useGroupCall must be used inside GroupCallProvider"
        );
    }

    return context;
}