import type { RecordingRecord } from "../persistence/db";

export type StatusFilter = RecordingRecord["status"] | "alle";
export type SortOrder = "keine" | "rating-aufsteigend" | "rating-absteigend";

export interface RecordingsFilter {
  status: StatusFilter;
  sortBy: SortOrder;
}

function sortByRating(
  recordings: RecordingRecord[],
  order: SortOrder,
): RecordingRecord[] {
  if (order === "keine") {
    return recordings;
  }
  const direction = order === "rating-aufsteigend" ? 1 : -1;
  return [...recordings].sort(
    (a, b) => direction * ((a.rating ?? 0) - (b.rating ?? 0)),
  );
}

export function filterAndSortRecordings(
  recordings: RecordingRecord[],
  filter: RecordingsFilter,
): RecordingRecord[] {
  const filtered =
    filter.status === "alle"
      ? recordings
      : recordings.filter((recording) => recording.status === filter.status);
  return sortByRating(filtered, filter.sortBy);
}
