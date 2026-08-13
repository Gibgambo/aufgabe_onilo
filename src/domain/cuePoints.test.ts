import { describe, expect, it } from "vitest";
import { generateCuePoints } from "./cuePoints";
import { findNextCuePoint } from "./cuePoints";
import { findPreviousCuePoint } from "./cuePoints";

describe("generateCuePoints", () => {
    it("liefert ein leeres Array bei Dauer 0", () => {
        expect(generateCuePoints(0, 25)).toEqual([]);
    });

    it("liefert nur den Start-Cue-Point, wenn die Dauer kleiner als das Intervall ist", () => {
        expect(generateCuePoints(10, 25)).toEqual([0]);
    });

    it("erzeugt Cue-Points bei exakten Intervall-Vielfachen", () => {
        expect(generateCuePoints(75, 25)).toEqual([0, 25, 50]);
    });

    it("nutzt 25 Sekunden als Standard-Intervall, wenn keins angegeben wird", () => {
        expect(generateCuePoints(60)).toEqual([0, 25, 50]);
    });
});

describe("findNextCuePoint", () => {
    const cues = [0, 25, 50, 75];

    it("springt zum nächsten Cue-Point nach der aktuellen Zeit", () => {
        expect(findNextCuePoint(cues, 30)).toBe(50);
    });

    it("bleibt beim letzten Cue-Point, wenn currentTime nach dem letzten liegt", () => {
        expect(findNextCuePoint(cues, 80)).toBe(75);
    });
});

describe("findPreviousCuePoint", () => {
    const cues = [0, 25, 50, 75];

    it("springt zum vorherigen Cue-Point vor der aktuellen Zeit", () => {
        expect(findPreviousCuePoint(cues, 60)).toBe(50);
    });

    it("landet an derselben Stelle, egal wo innerhalb des Kapitels currentTime liegt", () => {
        expect(findPreviousCuePoint(cues, 26)).toBe(25);
        expect(findPreviousCuePoint(cues, 49)).toBe(25);
    });

    it("bleibt beim ersten Cue-Point, wenn currentTime vor dem ersten liegt", () => {
        expect(findPreviousCuePoint([25, 50, 75], 10)).toBe(25);
    });
});