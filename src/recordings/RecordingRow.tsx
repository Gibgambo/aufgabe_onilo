import type { RecordingRecord } from "../persistence/db";
import { useEffect, useMemo } from "react";

const statusLabels: Record<RecordingRecord["status"], string> = {
  unbewertet: "Unbewertet",
  normal: "Normal",
  bestanden: "Bestanden",
};

export function RecordingRow({ recording }: { recording: RecordingRecord }) {
  const audioUrl = useMemo(
    () => URL.createObjectURL(recording.blob),
    [recording.blob],
  );

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);
  
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-onilo-primary">
          {recording.studentName}
        </span>
        <span className="text-sm font-medium text-onilo-primary">
          {statusLabels[recording.status]}
        </span>
      </div>
      <audio controls src={audioUrl} className="w-full" />
      <p className="text-sm text-onilo-primary">
        Bewertung: {recording.rating ?? "–"}
      </p>
      <p className="text-sm text-onilo-primary">
        Kommentar: {recording.comment ?? "–"}
      </p>
    </div>
  );
}
