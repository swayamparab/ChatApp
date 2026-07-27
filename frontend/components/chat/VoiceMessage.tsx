"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type VoiceMessageProps = {
    url: string;
};

export default function VoiceMessage({ url }: VoiceMessageProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const progressBarRef = useRef<HTMLDivElement>(null);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleLoadedMetadata = () => {
            if (Number.isFinite(audio.duration)) {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            }
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const handleOtherAudioPlay = (event: Event) => {
            const customEvent = event as CustomEvent<HTMLAudioElement>;

            const currentAudio = audioRef.current;

            if (
                !currentAudio ||
                customEvent.detail === currentAudio
            ) {
                return;
            }

            currentAudio.pause();
            setIsPlaying(false);
        };

        window.addEventListener(
            AUDIO_PLAY_EVENT,
            handleOtherAudioPlay
        );

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        if (audio.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            audio.pause();

            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            window.removeEventListener(
                AUDIO_PLAY_EVENT,
                handleOtherAudioPlay
            );
        };
    }, []);

    const AUDIO_PLAY_EVENT = "voice-message-play";

    const togglePlayback = async () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.paused) {
            try {
                window.dispatchEvent(
                    new CustomEvent(AUDIO_PLAY_EVENT, {
                        detail: audio,
                    })
                );
                await audio.play();
                setIsPlaying(true);
            }
            catch (error) {
                console.error(error);
            }
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const progress =
        duration === 0
            ? 0
            : (currentTime / duration) * 100;

    function formatTime(seconds: number) {
        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;
    }

    const seek = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        const audio = audioRef.current;
        const progressBar = progressBarRef.current;

        if (!audio || !progressBar) return;

        if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            return;
        }

        const rect = progressBar.getBoundingClientRect();

        const clickX = event.clientX - rect.left;

        const percentage = Math.min(
            Math.max(clickX / rect.width, 0),
            1
        );

        audio.currentTime = percentage * audio.duration;
    };

    const changePlaybackRate = () => {
        const audio = audioRef.current;

        if (!audio) return;

        const rates = [1, 1.5, 2];

        const currentIndex = rates.indexOf(playbackRate);

        const nextRate =
            rates[(currentIndex + 1) % rates.length];

        audio.playbackRate = nextRate;

        setPlaybackRate(nextRate);
    };

    return (
        <div className="flex w-[320px] max-w-full items-center gap-3">
            <audio
                ref={audioRef}
                src={url}
                preload="metadata"
            />

            <button
                onClick={togglePlayback}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 active:scale-95"
            >
                {isPlaying ? (
                    <Pause size={18} />
                ) : (
                    <Play
                        size={18}
                        className="ml-0.5"
                    />
                )}
            </button>

            <div ref={progressBarRef} onClick={seek} className="flex flex-1 flex-col gap-1">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                        {formatTime(currentTime)}
                    </span>

                    <button
                        onClick={changePlaybackRate}
                        className="font-medium hover:text-foreground"
                    >
                        {playbackRate}×
                    </button>

                    <span>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}