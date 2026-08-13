export function generateCuePoints(duration: number, intervalSec = 25): number[] {
    const cuePoints: number[] = [];
    for (let i = 0; i < duration; i += intervalSec) {
        cuePoints.push(i);
    }
    return cuePoints;
}

export function findNextCuePoint(cues: number[], currentTime: number): number {
    const nextCue = cues.find((cue) => cue > currentTime);
    return nextCue ?? cues[cues.length - 1];
}

export function findPreviousCuePoint(cues: number[], currentTime: number): number {
    const earlierCues = cues.filter((cue) => cue < currentTime);
    return earlierCues.length > 0 ? earlierCues[earlierCues.length - 1] : cues[0];
}