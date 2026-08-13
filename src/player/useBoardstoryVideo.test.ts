import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useBoardstoryVideo } from "./useBoardstoryVideo";
import * as dbModule from "../persistence/db";
import type { VideoRecord } from "../persistence/db";

function makeRecord(overrides: Partial<VideoRecord> = {}): VideoRecord {
  return {
    videoId: "video-1",
    name: "boardstory.mp4",
    mimeType: "video/mp4",
    uploadedAt: new Date().toISOString(),
    blob: new Blob(["fake"], { type: "video/mp4" }),
    cuePoints: [0, 25, 50],
    ...overrides,
  };
}

describe("useBoardstoryVideo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("startet im Status loading", () => {
    vi.spyOn(dbModule, "loadVideo").mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBoardstoryVideo("video-1"));

    expect(result.current.status).toBe("loading");
  });

  it("liefert Object-URL, MIME-Type und Cue-Points, sobald der Record geladen ist", async () => {
    const record = makeRecord();
    vi.spyOn(dbModule, "loadVideo").mockResolvedValue(record);
    const createObjectUrlSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock-url");

    const { result } = renderHook(() => useBoardstoryVideo("video-1"));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    const state = result.current;
    if (state.status !== "ready") {
      throw new Error("Erwarteter Status 'ready' wurde nicht erreicht");
    }

    expect(state.videoUrl).toBe("blob:mock-url");
    expect(state.mimeType).toBe(record.mimeType);
    expect(state.cuePoints).toEqual([0, 25, 50]);
    expect(createObjectUrlSpy).toHaveBeenCalledWith(record.blob);
  });

  it("liefert den Status not-found, wenn kein Record zur videoId existiert", async () => {
    vi.spyOn(dbModule, "loadVideo").mockResolvedValue(undefined);

    const { result } = renderHook(() => useBoardstoryVideo("unbekannt"));

    await waitFor(() => expect(result.current.status).toBe("not-found"));
  });

  it("revoked die Object-URL beim Unmount", async () => {
    const record = makeRecord();
    vi.spyOn(dbModule, "loadVideo").mockResolvedValue(record);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const revokeObjectUrlSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});

    const { result, unmount } = renderHook(() => useBoardstoryVideo("video-1"));
    await waitFor(() => expect(result.current.status).toBe("ready"));

    unmount();

    expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:mock-url");
  });

  it("loggt den Fehler und liefert den Status error, wenn loadVideo fehlschlägt", async () => {
    const loadError = new Error("IndexedDB nicht verfügbar");
    vi.spyOn(dbModule, "loadVideo").mockRejectedValue(loadError);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useBoardstoryVideo("video-1"));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Boardstory konnte nicht geladen werden",
      loadError,
    );
  });
});
