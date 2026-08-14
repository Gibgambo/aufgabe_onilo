import { describe, expect, it } from "vitest";
import { filterAndSortRecordings } from "./filterAndSortRecordings";
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

describe("filterAndSortRecordings", () => {
  it("gibt alle Recordings zurück, wenn nach 'alle' gefiltert wird", () => {
    const recordings = [
      makeRecording({ recordingId: "rec-1", status: "unbewertet" }),
      makeRecording({ recordingId: "rec-2", status: "bestanden" }),
    ];

    const result = filterAndSortRecordings(recordings, { status: "alle" });

    expect(result).toEqual(recordings);
  });

  it("gibt nur Recordings mit dem gewählten Status zurück", () => {
    const unbewertet = makeRecording({
      recordingId: "rec-1",
      status: "unbewertet",
    });
    const recordings = [
      unbewertet,
      makeRecording({ recordingId: "rec-2", status: "bestanden" }),
      makeRecording({ recordingId: "rec-3", status: "normal" }),
    ];

    const result = filterAndSortRecordings(recordings, {
      status: "unbewertet",
    });

    expect(result).toEqual([unbewertet]);
  });
});
