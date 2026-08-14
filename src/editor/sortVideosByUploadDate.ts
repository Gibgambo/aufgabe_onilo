import type { VideoRecord } from "../persistence/db";

export function sortVideosByUploadDate(
  videos: VideoRecord[],
): VideoRecord[] {
  return [...videos].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}
