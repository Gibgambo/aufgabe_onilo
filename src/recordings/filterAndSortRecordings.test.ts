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

    const result = filterAndSortRecordings(recordings, {
      status: "alle",
      sortBy: "keine",
    });

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
      sortBy: "keine",
    });

    expect(result).toEqual([unbewertet]);
  });

  it("sortiert nach Rating aufsteigend", () => {
    const rating2 = makeRecording({ recordingId: "rec-2", rating: 2 });
    const rating5 = makeRecording({ recordingId: "rec-5", rating: 5 });
    const unrated = makeRecording({ recordingId: "rec-0", rating: null });

    const result = filterAndSortRecordings([rating5, unrated, rating2], {
      status: "alle",
      sortBy: "rating-aufsteigend",
    });

    expect(result).toEqual([unrated, rating2, rating5]);
  });

  it("sortiert nach Rating absteigend, ohne die Eingabeliste zu verändern", () => {
    const rating2 = makeRecording({ recordingId: "rec-2", rating: 2 });
    const rating5 = makeRecording({ recordingId: "rec-5", rating: 5 });
    const original = [rating2, rating5];

    const result = filterAndSortRecordings(original, {
      status: "alle",
      sortBy: "rating-absteigend",
    });

    expect(result).toEqual([rating5, rating2]);
    expect(original).toEqual([rating2, rating5]);
  });
});
