import { describe, expect, it } from "vitest";
import { generateCuePoints } from "./cuePoints";

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