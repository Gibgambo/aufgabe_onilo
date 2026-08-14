import type { RecordingRecord } from "../persistence/db";
import { useEffect, useMemo, useState } from "react";

const statusLabels: Record<RecordingRecord["status"], string> = {
  unbewertet: "Unbewertet",
  normal: "Normal",
  bestanden: "Bestanden",
};

const statuses = Object.keys(statusLabels) as RecordingRecord["status"][];

export interface RecordingRowProps {
  recording: RecordingRecord;
  onStatusChange: (
    recordingId: string,
    status: RecordingRecord["status"],
  ) => void;
  onRatingChange: (recordingId: string, rating: number) => void;
  onCommentChange: (recordingId: string, comment: string) => void;
}

export function RecordingRow({
  recording,
  onStatusChange,
  onRatingChange,
  onCommentChange,
}: RecordingRowProps) {
  const audioUrl = useMemo(
    () => URL.createObjectURL(recording.blob),
    [recording.blob],
  );

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const [commentDraft, setCommentDraft] = useState(recording.comment ?? "");
  const [draftRecordingId, setDraftRecordingId] = useState(
    recording.recordingId,
  );

  if (recording.recordingId !== draftRecordingId) {
    setDraftRecordingId(recording.recordingId);
    setCommentDraft(recording.comment ?? "");
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-onilo-primary">
          {recording.studentName}
        </span>
        <div className="flex gap-1">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={recording.status === status}
              onClick={() => onStatusChange(recording.recordingId, status)}
              className={
                recording.status === status
                  ? "rounded-full bg-onilo-primary px-3 py-1 text-sm font-medium text-white"
                  : "rounded-full bg-onilo-primary/10 px-3 py-1 text-sm font-medium text-onilo-primary"
              }
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>
      <audio controls src={audioUrl} className="w-full" />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-pressed={star <= (recording.rating ?? 0)}
            aria-label={`${star} Stern${star === 1 ? "" : "e"}`}
            onClick={() => onRatingChange(recording.recordingId, star)}
            className={
              star <= (recording.rating ?? 0)
                ? "text-2xl text-onilo-accent"
                : "text-2xl text-onilo-primary/30"
            }
          >
            ★
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-onilo-primary">
        Kommentar
        <textarea
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.target.value)}
          onBlur={() => onCommentChange(recording.recordingId, commentDraft)}
          className="rounded-lg border border-onilo-primary/30 bg-white px-3 py-2 text-black"
        />
      </label>
    </div>
  );
}
