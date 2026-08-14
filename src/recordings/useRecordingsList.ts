import { useEffect, useState } from "react";
import { listRecordings, updateRecording } from "../persistence/db";
import type { RecordingRecord, RecordingUpdate } from "../persistence/db";

export type RecordingsListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; recordings: RecordingRecord[] };

export interface UseRecordingsListResult {
  state: RecordingsListState;
  updateError: boolean;
  updateRecordingFields: (
    recordingId: string,
    updates: RecordingUpdate,
  ) => Promise<void>;
}

export function useRecordingsList(): UseRecordingsListResult {
  const [state, setState] = useState<RecordingsListState>({
    status: "loading",
  });
  const [updateError, setUpdateError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    listRecordings()
      .then((recordings) => {
        if (!isCancelled) {
          setState({ status: "ready", recordings });
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.error("Recordings konnten nicht geladen werden", error);
          setState({ status: "error" });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  async function updateRecordingFields(
    recordingId: string,
    updates: RecordingUpdate,
  ) {
    try {
      await updateRecording(recordingId, updates);
      setUpdateError(false);
      setState((current) =>
        current.status === "ready"
          ? {
              status: "ready",
              recordings: current.recordings.map((recording) =>
                recording.recordingId === recordingId
                  ? { ...recording, ...updates }
                  : recording,
              ),
            }
          : current,
      );
    } catch (error) {
      console.error("Recording konnte nicht aktualisiert werden", error);
      setUpdateError(true);
    }
  }

  return { state, updateError, updateRecordingFields };
}
