import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { validateUpload } from "../persistence/db";
import { uploadBoardstory } from "../editor/uploadBoardstory";
import { useVideosList } from "../editor/useVideosList";

export function Editor() {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videosListState = useVideosList();
  const navigate = useNavigate();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationError = validateUpload(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const videoId = await uploadBoardstory(file);
      navigate(`/player/${videoId}`);
    } catch (uploadError) {
      console.error("Boardstory-Upload fehlgeschlagen", uploadError);
      setError(
        "Die Boardstory konnte nicht hochgeladen werden. Bitte versuche es erneut.",
      );
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-onilo-background flex flex-col items-center justify-start gap-6 p-6">
      <h1 className="text-onilo-primary text-3xl font-bold">Editor</h1>
      <label
        className="bg-onilo-primary hover:bg-onilo-secondary text-white text-xl font-semibold px-8 py-4
    rounded-xl cursor-pointer"
      >
        Boardstory hochladen
        <input
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      {isUploading && (
        <p role="status" className="text-onilo-primary text-lg font-medium">
          Boardstory wird hochgeladen…
        </p>
      )}
      {error && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          {error}
        </p>
      )}
      {videosListState.status === "loading" && (
        <p role="status" className="text-onilo-primary text-lg font-medium">
          Boardstories werden geladen…
        </p>
      )}

      {videosListState.status === "error" && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          Boardstories konnten nicht geladen werden. Bitte versuche es erneut.
        </p>
      )}

      {videosListState.status === "ready" &&
        videosListState.videos.length === 0 && (
          <p className="text-onilo-primary text-lg">
            Noch keine Boardstory hochgeladen.
          </p>
        )}

      {videosListState.status === "ready" &&
        videosListState.videos.length > 0 && (
          <ul className="flex w-full max-w-2xl flex-col gap-2">
            {videosListState.videos.map((video) => (
              <li key={video.videoId}>
                <Link
                  to={`/player/${video.videoId}`}
                  className="flex items-center justify-between rounded-lg border border-onilo-primary/30 bg-white px-4 py-2
    hover:bg-onilo-background"
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
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
