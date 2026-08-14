import type { RecordingRecord } from "../persistence/db";

export type StatusFilter = RecordingRecord["status"] | "alle";
export type RatingFilter = 1 | 2 | 3 | 4 | 5 | "alle";
export type SortOrder = "keine" | "rating-aufsteigend" | "rating-absteigend";

export interface RecordingsFilter {
  status: StatusFilter;
  rating: RatingFilter;
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
  const filteredByStatus =
    filter.status === "alle"
      ? recordings
      : recordings.filter((recording) => recording.status === filter.status);
  const filteredByRating =
    filter.rating === "alle"
      ? filteredByStatus
      : filteredByStatus.filter(
          (recording) => recording.rating === filter.rating,
        );
  return sortByRating(filteredByRating, filter.sortBy);
}
