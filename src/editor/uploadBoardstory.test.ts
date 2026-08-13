import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadBoardstory } from "./uploadBoardstory";
import * as db from "../persistence/db";
import * as videoDuration from "./videoDuration";

function makeFile(name: string, type: string): File {
  return new File(["fake-content"], name, { type });
}

describe("uploadBoardstory", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generiert Cue-Points aus der Videodauer und speichert die Boardstory", async () => {
    vi.spyOn(videoDuration, "getVideoDuration").mockResolvedValue(100);
    vi.spyOn(db, "saveVideo").mockResolvedValue("video-123");

    const videoId = await uploadBoardstory(
      makeFile("boardstory.mp4", "video/mp4"),
    );

    expect(videoId).toBe("video-123");
    expect(db.saveVideo).toHaveBeenCalledWith({
      name: "boardstory.mp4",
      mimeType: "video/mp4",
      blob: expect.any(File),
      cuePoints: [0, 25, 50, 75],
    });
  });

  it("reicht den Fehler weiter und speichert nicht, wenn die Videodauer nicht ermittelt werden kann", async () => {
    vi.spyOn(videoDuration, "getVideoDuration").mockRejectedValue(
      new Error("Videodauer konnte nicht ermittelt werden"),
    );
    const saveVideoSpy = vi.spyOn(db, "saveVideo");

    await expect(
      uploadBoardstory(makeFile("boardstory.mp4", "video/mp4")),
    ).rejects.toThrow();
    expect(saveVideoSpy).not.toHaveBeenCalled();
  });

  it("reicht den Fehler weiter, wenn das Speichern fehlschlägt", async () => {
    vi.spyOn(videoDuration, "getVideoDuration").mockResolvedValue(100);
    vi.spyOn(db, "saveVideo").mockRejectedValue(new Error("Quota exceeded"));

    await expect(
      uploadBoardstory(makeFile("boardstory.mp4", "video/mp4")),
    ).rejects.toThrow();
  });
});
