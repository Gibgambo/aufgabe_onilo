import { useEffect, useState } from "react";
import { loadVideo } from "../persistence/db";

export type BoardstoryVideoState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | {
      status: "ready";
      videoUrl: string;
      mimeType: string;
      cuePoints: number[];
    };

const initialState: BoardstoryVideoState = { status: "loading" };

export function useBoardstoryVideo(videoId: string): BoardstoryVideoState {
  const [state, setState] = useState<BoardstoryVideoState>(initialState);
  const [loadedVideoId, setLoadedVideoId] = useState(videoId);

  if (videoId !== loadedVideoId) {
    setLoadedVideoId(videoId);
    setState(initialState);
  }

  useEffect(() => {
    let isCancelled = false;
    let objectUrl: string | null = null;

    loadVideo(videoId)
      .then((record) => {
        if (isCancelled) {
          return;
        }
        if (!record) {
          setState({ status: "not-found" });
          return;
        }
        objectUrl = URL.createObjectURL(record.blob);
        setState({
          status: "ready",
          videoUrl: objectUrl,
          mimeType: record.mimeType,
          cuePoints: record.cuePoints,
        });
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        console.error("Boardstory konnte nicht geladen werden", error);
        setState({ status: "error" });
      });

    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoId]);

  return state;
}
