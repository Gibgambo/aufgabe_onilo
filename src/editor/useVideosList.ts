import { useEffect, useState } from "react";
import { listVideos } from "../persistence/db";
import type { VideoRecord } from "../persistence/db";
import { sortVideosByUploadDate } from "./sortVideosByUploadDate";

export type VideosListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; videos: VideoRecord[] };

export function useVideosList(): VideosListState {
  const [state, setState] = useState<VideosListState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    listVideos()
      .then((videos) => {
        if (!isCancelled) {
          setState({ status: "ready", videos: sortVideosByUploadDate(videos) });
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Videos konnten nicht geladen werden", error);
          setState({ status: "error" });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
}
