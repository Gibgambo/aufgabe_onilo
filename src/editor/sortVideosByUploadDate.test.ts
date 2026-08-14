import { describe, expect, it } from "vitest";
import { sortVideosByUploadDate } from "./sortVideosByUploadDate";
import type { VideoRecord } from "../persistence/db";

function makeVideo(overrides: Partial<VideoRecord> = {}): VideoRecord {
  return {
    videoId: "video-1",
    name: "Boardstory A",
    mimeType: "video/mp4",
    uploadedAt: "2026-01-01T10:00:00.000Z",
    blob: new Blob(["video"], { type: "video/mp4" }),
    cuePoints: [],
    ...overrides,
  };
}

describe("sortVideosByUploadDate", () => {
  it("sortiert Videos nach uploadedAt absteigend, neueste zuerst", () => {
    const older = makeVideo({
      videoId: "video-old",
      uploadedAt: "2026-01-01T10:00:00.000Z",
    });
    const newer = makeVideo({
      videoId: "video-new",
      uploadedAt: "2026-01-02T10:00:00.000Z",
    });

    const result = sortVideosByUploadDate([older, newer]);

    expect(result.map((v) => v.videoId)).toEqual(["video-new", "video-old"]);
  });

  it("verändert die Eingabeliste nicht", () => {
    const older = makeVideo({
      videoId: "video-old",
      uploadedAt: "2026-01-01T10:00:00.000Z",
    });
    const newer = makeVideo({
      videoId: "video-new",
      uploadedAt: "2026-01-02T10:00:00.000Z",
    });
    const original = [older, newer];

    sortVideosByUploadDate(original);

    expect(original).toEqual([older, newer]);
  });
});
