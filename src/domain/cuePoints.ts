export function generateCuePoints(
  duration: number,
  intervalSec = 25,
): number[] {
  const cuePoints: number[] = [];
  for (let i = 0; i < duration; i += intervalSec) {
    cuePoints.push(i);
  }
  return cuePoints;
}

function assertCuesNotEmpty(cues: number[]): void {
  if (cues.length === 0) {
    throw new Error(
      "cues darf nicht leer sein — es muss mindestens ein Cue-Point vorhanden sein",
    );
  }
}

export function findNextCuePoint(cues: number[], currentTime: number): number {
  assertCuesNotEmpty(cues);
  const nextCue = cues.find((cue) => cue > currentTime);
  return nextCue ?? cues[cues.length - 1];
}

export function findPreviousCuePoint(
  cues: number[],
  currentTime: number,
): number {
  assertCuesNotEmpty(cues);
  const earlierCues = cues.filter((cue) => cue < currentTime);
  return earlierCues.length > 0 ? earlierCues[earlierCues.length - 1] : cues[0];
}
