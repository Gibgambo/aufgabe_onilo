import { useEffect, useState } from "react";
import { listVideos } from "../persistence/db";
import type { VideoRecord } from "../persistence/db";

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
          const sorted = [...videos].sort((a, b) =>
            b.uploadedAt.localeCompare(a.uploadedAt),
          );
          setState({ status: "ready", videos: sorted });
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
