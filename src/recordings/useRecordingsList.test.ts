import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRecordingsList } from "./useRecordingsList";
import * as db from "../persistence/db";
import type { RecordingRecord } from "../persistence/db";

function makeRecording(
  overrides: Partial<RecordingRecord> = {},
): RecordingRecord {
  return {
    recordingId: "rec-1",
    videoId: "video-1",
    studentName: "Tim",
    blob: new Blob(["audio"], { type: "audio/webm" }),
    status: "unbewertet",
    rating: null,
    comment: null,
    ...overrides,
  };
}

describe("useRecordingsList", () => {
  it("liefert die geladenen Recordings, sobald das Laden abgeschlossen ist", async () => {
    const recordings = [makeRecording()];
    vi.spyOn(db, "listRecordings").mockResolvedValue(recordings);

    const { result } = renderHook(() => useRecordingsList());

    expect(result.current.state.status).toBe("loading");
    await waitFor(() =>
      expect(result.current.state).toEqual({ status: "ready", recordings }),
    );
  });

  it("liefert den error-Status, wenn das Laden fehlschlägt", async () => {
    vi.spyOn(db, "listRecordings").mockRejectedValue(new Error("db kaputt"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useRecordingsList());

    await waitFor(() => expect(result.current.state.status).toBe("error"));
  });

  it("aktualisiert ein Recording persistent und spiegelt die Änderung sofort in der Liste", async () => {
    const recordings = [makeRecording({ status: "unbewertet", rating: null })];
    vi.spyOn(db, "listRecordings").mockResolvedValue(recordings);
    const updateSpy = vi
      .spyOn(db, "updateRecording")
      .mockResolvedValue(undefined);

    const { result } = renderHook(() => useRecordingsList());
    await waitFor(() => expect(result.current.state.status).toBe("ready"));

    await result.current.updateRecordingFields("rec-1", {
      status: "bestanden",
      rating: 5,
    });

    expect(updateSpy).toHaveBeenCalledWith("rec-1", {
      status: "bestanden",
      rating: 5,
    });

    await waitFor(() =>
      expect(result.current.state).toEqual({
        status: "ready",
        recordings: [makeRecording({ status: "bestanden", rating: 5 })],
      }),
    );
  });

  it("setzt updateError, wenn das Speichern einer Änderung fehlschlägt", async () => {
    const recordings = [makeRecording()];
    vi.spyOn(db, "listRecordings").mockResolvedValue(recordings);
    vi.spyOn(db, "updateRecording").mockRejectedValue(new Error("db kaputt"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useRecordingsList());
    await waitFor(() => expect(result.current.state.status).toBe("ready"));

    await result.current.updateRecordingFields("rec-1", {
      status: "bestanden",
    });

    await waitFor(() => expect(result.current.updateError).toBe(true));
    expect(result.current.state).toEqual({ status: "ready", recordings });
  });
});
