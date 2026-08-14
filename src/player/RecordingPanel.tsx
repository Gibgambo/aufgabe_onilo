import { useState } from "react";
import { useRecording } from "./useRecording";
import { recordButtonClass, stopButtonClass } from "./playerStyles";
import { MicIcon, StopIcon } from "./icons";

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
    <div className="flex w-full max-w-6xl flex-col items-center gap-5 rounded-[28px] bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex items-center gap-4 self-start sm:self-auto">
        <span className="bg-onilo-accent/10 text-onilo-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <MicIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-onilo-primary text-lg font-semibold">
            Selbst vorlesen
          </p>
          <p className="text-onilo-primary/70 text-sm">
            Nimm dich beim Vorlesen auf. Deine Lehrkraft hört es sich an.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <label className="text-onilo-primary flex flex-col gap-1 font-medium">
          <span aria-hidden="true" className="text-onilo-primary/70 text-sm">
            Wie lautet dein Name?
          </span>
          <input
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            disabled={!canRetry}
            placeholder="Dein Name"
            aria-label="Wie lautet dein Name?"
            className="border-onilo-primary/20 focus-visible:outline-onilo-secondary w-full rounded-2xl border-2 bg-white px-4 py-3 text-base text-black outline-none focus-visible:outline-4 sm:w-48"
          />
        </label>

        <button
          type="button"
          onClick={() => (isRecording ? stop() : start(studentName.trim()))}
          disabled={!isRecording && !canStart}
          className={isRecording ? stopButtonClass : recordButtonClass}
          aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
        >
          {isRecording ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <MicIcon className="h-6 w-6" />
          )}
          {isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
        </button>
      </div>

      {isRecording && (
        <p
          role="status"
          className="text-onilo-accent font-display order-last w-full text-center text-base font-semibold sm:w-auto"
        >
          ● Aufnahme läuft…
        </p>
      )}

      {state.status === "permission-denied" && (
        <p
          role="alert"
          className="text-onilo-accent order-last w-full text-center text-sm font-medium sm:w-auto sm:text-left"
        >
          Mikrofon-Zugriff wurde verweigert. Bitte erlaube den Zugriff in deinem
          Browser, um eine Aufnahme zu starten.
        </p>
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="text-onilo-accent order-last w-full text-center text-sm font-medium sm:w-auto sm:text-left"
        >
          Die Aufnahme konnte nicht gespeichert werden. Bitte versuche es
          erneut.
        </p>
      )}
    </div>
  );
}
