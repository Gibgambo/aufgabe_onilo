import { saveVideo } from "../persistence/db";
import { generateCuePoints } from "../domain/cuePoints";
import { getVideoDuration } from "./videoDuration";

export async function uploadBoardstory(file: File): Promise<string> {
  const duration = await getVideoDuration(file);
  const cuePoints = generateCuePoints(duration);
  return saveVideo({
    name: file.name,
    mimeType: file.type,
    blob: file,
    cuePoints,
  });
}
