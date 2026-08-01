"use client";

let incomingAudio: HTMLAudioElement | null = null;
let outgoingAudio: HTMLAudioElement | null = null;

export function useRingtone() {
    function playIncoming() {
        if (!incomingAudio) {
            incomingAudio = new Audio("/sounds/incoming.mp3");
            incomingAudio.loop = true;
        }

        incomingAudio.currentTime = 0;
        incomingAudio.play().catch(() => { });
    }

    function stopIncoming() {
        incomingAudio?.pause();

        if (incomingAudio) {
            incomingAudio.currentTime = 0;
        }
    }

    function playOutgoing() {
        if (!outgoingAudio) {
            outgoingAudio = new Audio("/sounds/outgoing.mp3");
            outgoingAudio.loop = true;
        }

        outgoingAudio.currentTime = 0;
        outgoingAudio.play().catch(() => { });
    }

    function stopOutgoing() {
        outgoingAudio?.pause();

        if (outgoingAudio) {
            outgoingAudio.currentTime = 0;
        }
    }

    return {
        playIncoming,
        stopIncoming,
        playOutgoing,
        stopOutgoing,
    };
}