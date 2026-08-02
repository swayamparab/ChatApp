export async function generateWaveform(
    blob: Blob
): Promise<number[]> {
    const arrayBuffer = await blob.arrayBuffer();

    const audioContext = new AudioContext();

    const audioBuffer =
        await audioContext.decodeAudioData(arrayBuffer);

    const samples = audioBuffer.getChannelData(0);

    const bars = 36;

    const blockSize = Math.floor(samples.length / bars);

    const waveform: number[] = [];

    for (let i = 0; i < bars; i++) {
        const start = i * blockSize;
        const end = start + blockSize;

        let peak = 0;

        for (let j = start; j < end; j++) {
            const value = Math.abs(samples[j]);

            if (value > peak) {
                peak = value;
            }
        }

        waveform.push(peak);
    }

    const maxPeak = Math.max(...waveform);

    const normalized = waveform.map((value) =>
        Math.max(
            4,
            Math.round((value / maxPeak) * 28)
        )
    );

    // Smooth neighbouring bars
    const smoothed = normalized.map((_, index, arr) => {
        const prev = arr[index - 1] ?? arr[index];
        const curr = arr[index];
        const next = arr[index + 1] ?? arr[index];

        return Math.round((prev + curr + next) / 3);
    });

    audioContext.close();

    // console.log(smoothed);

    return smoothed;
}