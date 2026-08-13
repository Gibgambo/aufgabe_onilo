import { describe, expect, it } from "vitest";
import { validateUpload } from "./db";

function makeFile(type: string, sizeBytes: number): File {
    return new File([new Uint8Array(sizeBytes)], "boardstory.mp4", { type });
}

describe("validateUpload", () => {
    it("akzeptiert eine gültige MP4-Datei innerhalb der Größengrenze", () => {
        expect(validateUpload(makeFile("video/mp4", 1024))).toBeNull();
    });

    it("lehnt einen nicht unterstützten MIME-Type ab", () => {
        expect(validateUpload(makeFile("application/zip", 1024))).not.toBeNull();
    });

    it("akzeptiert eine Datei knapp unter der 500-MB-Grenze", () => {
        const justUnderLimit = 500 * 1024 * 1024 - 1;
        expect(validateUpload(makeFile("video/mp4", justUnderLimit))).toBeNull();
    });

    it("lehnt eine Datei knapp über der 500-MB-Grenze ab", () => {
        const justOverLimit = 500 * 1024 * 1024 + 1;
        expect(validateUpload(makeFile("video/mp4", justOverLimit))).not.toBeNull();
    });
});