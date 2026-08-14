import { Link } from "react-router";
import type { VideoRecord } from "../persistence/db";

export interface VideoRowProps {
  video: VideoRecord;
}

export function VideoRow({ video }: VideoRowProps) {
  return (
    <Link
      to={`/player/${video.videoId}`}
      className="flex items-center justify-between rounded-lg border border-onilo-primary/30 bg-white px-4 py-2 hover:bg-onilo-background"
    >
      <span>{video.name}</span>
      <span className="flex items-center gap-2">
        {new Date(video.uploadedAt).toLocaleDateString("de-DE")}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-7 w-7 fill-onilo-primary"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </Link>
  );
}
