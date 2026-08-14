import { useState } from "react";
import { useRecording } from "./useRecording";
import { controlButtonClass } from "./playerStyles";

export function RecordingPanel({ videoId }: { videoId: string }) {
  const [studentName, setStudentName] = useState("");
  const { state, start, stop } = useRecording(videoId);
  const isRecording = state.status === "recording";
  const canRetry =
    state.status === "idle" ||
    state.status === "permission-denied" ||
    state.status === "error";
  const canStart = studentName.trim().length > 0 && canRetry;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3 rounded-xl bg-white p-6 shadow">
      <label className="flex w-full max-w-sm flex-col gap-1 font-medium text-onilo-primary">
        Wie lautet dein Name?
        <input
          type="text"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          disabled={!canRetry}
          className="rounded-lg border border-onilo-primary/30 bg-white px-3 py-2 text-black"
        />
      </label>

      <button
        type="button"
        onClick={() => (isRecording ? stop() : start(studentName.trim()))}
        disabled={!isRecording && !canStart}
        className={controlButtonClass}
        aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
      >
        {isRecording ? "⏹" : "🎙"}
      </button>

      {isRecording && (
        <p role="status" className="text-onilo-accent text-lg font-semibold">
          ● Aufnahme läuft…
        </p>
      )}

      {state.status === "permission-denied" && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          Mikrofon-Zugriff wurde verweigert. Bitte erlaube den Zugriff in deinem
          Browser, um eine Aufnahme zu starten.
        </p>
      )}

      {state.status === "error" && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          Die Aufnahme konnte nicht gespeichert werden. Bitte versuche es
          erneut.
        </p>
      )}
    </div>
  );
}
