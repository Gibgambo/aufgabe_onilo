import type { RecordingRecord } from "../persistence/db";

export type StatusFilter = RecordingRecord["status"] | "alle";

export interface RecordingsFilter {
  status: StatusFilter;
}

export function filterAndSortRecordings(
  recordings: RecordingRecord[],
  filter: RecordingsFilter,
): RecordingRecord[] {
  if (filter.status === "alle") {
    return recordings;
  }
  return recordings.filter((recording) => recording.status === filter.status);
}
