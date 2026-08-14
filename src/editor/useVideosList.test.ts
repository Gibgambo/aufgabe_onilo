import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useVideosList } from "./useVideosList";
import * as db from "../persistence/db";
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

describe("useVideosList", () => {
  it("liefert die geladenen Videos, sobald das Laden abgeschlossen ist", async () => {
    const videos = [makeVideo()];
    vi.spyOn(db, "listVideos").mockResolvedValue(videos);

    const { result } = renderHook(() => useVideosList());

    expect(result.current.status).toBe("loading");
    await waitFor(() =>
      expect(result.current).toEqual({ status: "ready", videos }),
    );
  });

  it("sortiert die Videos vor dem ready-Status nach uploadedAt absteigend", async () => {
    const older = makeVideo({
      videoId: "video-old",
      uploadedAt: "2026-01-01T10:00:00.000Z",
    });
    const newer = makeVideo({
      videoId: "video-new",
      uploadedAt: "2026-01-02T10:00:00.000Z",
    });
    vi.spyOn(db, "listVideos").mockResolvedValue([older, newer]);

    const { result } = renderHook(() => useVideosList());

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(
      result.current.status === "ready" &&
        result.current.videos.map((v) => v.videoId),
    ).toEqual(["video-new", "video-old"]);
  });

  it("liefert den error-Status, wenn das Laden fehlschlägt", async () => {
    vi.spyOn(db, "listVideos").mockRejectedValue(new Error("db kaputt"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useVideosList());

    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
