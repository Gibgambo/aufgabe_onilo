// @vitest-environment node
// node als Testumgebung anstatt jsdom, da jsdom keine blob Klasse supportet
import { describe, expect, it } from "vitest";
import {
  validateUpload,
  saveVideo,
  loadVideo,
  saveRecording,
  listRecordings,
  updateRecording,
} from "./db";

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

describe("saveVideo / loadVideo", () => {
  it("speichert ein Video und lädt es per videoId wieder, inkl. Cue-Points", async () => {
    const blob = new Blob(["fake-video-data"], { type: "video/mp4" });
    const videoId = await saveVideo({
      name: "Meine Boardstory",
      mimeType: "video/mp4",
      blob,
      cuePoints: [0, 25, 50],
    });

    const loaded = await loadVideo(videoId);

    expect(loaded).toBeDefined();
    expect(loaded?.videoId).toBe(videoId);
    expect(loaded?.name).toBe("Meine Boardstory");
    expect(loaded?.cuePoints).toEqual([0, 25, 50]);
    expect(loaded?.blob).toBeInstanceOf(Blob);
  });

  it("gibt undefined zurück, wenn keine videoId existiert", async () => {
    const loaded = await loadVideo("does-not-exist");
    expect(loaded).toBeUndefined();
  });

  it("generiert für jeden Aufruf eine neue, eindeutige videoId", async () => {
    const blob = new Blob(["data"], { type: "video/mp4" });
    const idA = await saveVideo({
      name: "A",
      mimeType: "video/mp4",
      blob,
      cuePoints: [],
    });
    const idB = await saveVideo({
      name: "B",
      mimeType: "video/mp4",
      blob,
      cuePoints: [],
    });
    expect(idA).not.toBe(idB);
  });
});

describe("saveRecording / listRecordings", () => {
  it("speichert ein Recording mit den korrekten Default-Werten", async () => {
    const videoId = await saveVideo({
      name: "Boardstory für Recording-Test",
      mimeType: "video/mp4",
      blob: new Blob(["video"], { type: "video/mp4" }),
      cuePoints: [0],
    });
    const blob = new Blob(["audio"], { type: "audio/webm" });

    const recordingId = await saveRecording({
      videoId,
      studentName: "Tim",
      blob,
    });

    const all = await listRecordings();
    const saved = all.find((r) => r.recordingId === recordingId);

    expect(saved).toBeDefined();
    expect(saved?.studentName).toBe("Tim");
    expect(saved?.status).toBe("unbewertet");
    expect(saved?.rating).toBeNull();
    expect(saved?.comment).toBeNull();
  });

  it("filtert listRecordings nach videoId", async () => {
    const videoIdA = await saveVideo({
      name: "Video A",
      mimeType: "video/mp4",
      blob: new Blob(["a"], { type: "video/mp4" }),
      cuePoints: [0],
    });
    const videoIdB = await saveVideo({
      name: "Video B",
      mimeType: "video/mp4",
      blob: new Blob(["b"], { type: "video/mp4" }),
      cuePoints: [0],
    });
    await saveRecording({
      videoId: videoIdA,
      studentName: "Anna",
      blob: new Blob(["x"]),
    });
    await saveRecording({
      videoId: videoIdB,
      studentName: "Ben",
      blob: new Blob(["y"]),
    });

    const recordingsForA = await listRecordings(videoIdA);

    expect(recordingsForA).toHaveLength(1);
    expect(recordingsForA[0].studentName).toBe("Anna");
  });
});

describe("updateRecording", () => {
  async function createRecording(): Promise<string> {
    const videoId = await saveVideo({
      name: "Boardstory für Update-Test",
      mimeType: "video/mp4",
      blob: new Blob(["video"], { type: "video/mp4" }),
      cuePoints: [0],
    });
    return saveRecording({
      videoId,
      studentName: "Lea",
      blob: new Blob(["audio"], { type: "audio/webm" }),
    });
  }

  it("aktualisiert nur die übergebenen Felder, Rest bleibt erhalten", async () => {
    const recordingId = await createRecording();

    await updateRecording(recordingId, { status: "bestanden" });

    const found = (await listRecordings()).find(
      (r) => r.recordingId === recordingId,
    );
    expect(found?.status).toBe("bestanden");
    expect(found?.rating).toBeNull();
    expect(found?.studentName).toBe("Lea");
  });

  it("aktualisiert Rating und Kommentar zusammen", async () => {
    const recordingId = await createRecording();

    await updateRecording(recordingId, {
      rating: 5,
      comment: "Sehr flüssig vorgelesen!",
    });

    const found = (await listRecordings()).find(
      (r) => r.recordingId === recordingId,
    );
    expect(found?.rating).toBe(5);
    expect(found?.comment).toBe("Sehr flüssig vorgelesen!");
  });

  it("wirft einen Fehler bei nicht existierender recordingId", async () => {
    await expect(
      updateRecording("does-not-exist", { status: "normal" }),
    ).rejects.toThrow();
  });
});
