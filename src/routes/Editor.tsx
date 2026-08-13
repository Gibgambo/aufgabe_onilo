import { useState } from "react";
import { validateUpload } from "../persistence/db";

export function Editor() {
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
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
  }

  return (
    <div className="min-h-screen bg-onilo-background flex flex-col items-center justify-center gap-6 p-6">
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
        />
      </label>
      {error && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
