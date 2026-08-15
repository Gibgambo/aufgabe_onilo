import type { RecordingState } from "./useRecording";

const statusTextClass = "font-display text-center text-base font-semibold";
const alertTextClass = "text-center text-sm font-medium";

export function RecordingStatusLine({ state }: { state: RecordingState }) {
  if (state.status === "requesting-permission") {
    return (
      <p role="status" className={`text-onilo-primary ${statusTextClass}`}>
        Warte auf Mikrofon-Freigabe im Browser…
      </p>
    );
  }

  if (state.status === "recording") {
    return (
      <p role="status" className={`text-onilo-accent ${statusTextClass}`}>
        ● Aufnahme läuft…
      </p>
    );
  }

  if (state.status === "saved") {
    return (
      <p role="status" className={`text-onilo-primary ${statusTextClass}`}>
        Aufnahme gespeichert!
      </p>
    );
  }

  if (state.status === "permission-denied") {
    return (
      <p role="alert" className={`text-onilo-accent ${alertTextClass}`}>
        Mikrofon-Zugriff wurde verweigert. Bitte erlaube den Zugriff in
        deinem Browser, um eine Aufnahme zu starten.
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <p role="alert" className={`text-onilo-accent ${alertTextClass}`}>
        Die Aufnahme konnte nicht gespeichert werden. Bitte versuche es
        erneut.
      </p>
    );
  }

  return null;
}
