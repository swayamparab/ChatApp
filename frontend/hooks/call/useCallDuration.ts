"use client";

import { useEffect, useState } from "react";

export function useCallDuration(
    connectedAt: number | null
) {
    const [duration, setDuration] = useState("00:00");

    useEffect(() => {
        if (!connectedAt) {
            setDuration("00:00");
            return;
        }

        const interval = setInterval(() => {
            const seconds = Math.floor(
                (Date.now() - connectedAt) / 1000
            );

            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;

            setDuration(
                `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [connectedAt]);

    return duration;
}