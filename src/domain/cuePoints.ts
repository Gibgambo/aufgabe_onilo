export function generateCuePoints(duration: number, intervalSec = 25): number[] {
    const cuePoints: number[] = [];
    for (let i = 0; i < duration; i += intervalSec) {
        cuePoints.push(i);
    }
    return cuePoints;
}