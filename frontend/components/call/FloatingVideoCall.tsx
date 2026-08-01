"use client";

import { useRef, useState, useEffect } from "react";

import { Maximize2 } from "lucide-react";

import { useCall } from "@/hooks/call/useCall";

import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";

export function FloatingVideoCall() {
    const { setIsVideoMinimized } = useCall();

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [isDragging, setIsDragging] = useState(false);

    const dragOffset = useRef({
        x: 0,
        y: 0,
    });

    const hasMoved = useRef(false);

    useEffect(() => {
        setPosition({
            x: window.innerWidth - 210,
            y: window.innerHeight - 290,
        });
    }, []);

    useEffect(() => {
        if (!isDragging) return;

        function handlePointerMove(e: PointerEvent) {
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;

            if (
                Math.abs(newX - position.x) > 5 ||
                Math.abs(newY - position.y) > 5
            ) {
                hasMoved.current = true;
            }

            setPosition({
                x: newX,
                y: newY,
            });
        }

        function handlePointerUp() {
            setIsDragging(false);
        }

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );
        };
    }, [isDragging, position]);

    function handlePointerDown(
        e: React.PointerEvent<HTMLDivElement>
    ) {
        e.currentTarget.setPointerCapture(e.pointerId);

        setIsDragging(true);

        hasMoved.current = false;

        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }

    return (
        <div
            onPointerDown={handlePointerDown}
            onClick={() => {
                if (hasMoved.current) {
                    hasMoved.current = false;
                    return;
                }

                setIsVideoMinimized(false);
            }}
            style={{
                left: position.x,
                top: position.y,
            }}
            className={`
                fixed
                z-[100]
                h-64
                w-44
                overflow-hidden
                rounded-2xl
                border
                border-slate-700
                bg-black
                shadow-2xl
                select-none
                touch-none
                ${
                    isDragging
                        ? "cursor-grabbing"
                        : "cursor-grab"
                }
            `}
        >
            <RemoteVideo />

            <div
                className="
                    absolute
                    bottom-2
                    right-2
                    h-20
                    w-14
                    overflow-hidden
                    rounded-lg
                    border
                    border-slate-700
                    shadow-lg
                "
            >
                <LocalVideo />
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsVideoMinimized(false);
                }}
                className="
                    absolute
                    top-2
                    right-2
                    rounded-full
                    bg-black/60
                    p-2
                    text-white
                    backdrop-blur
                    transition
                    hover:bg-black/80
                "
            >
                <Maximize2 className="h-4 w-4" />
            </button>
        </div>
    );
}