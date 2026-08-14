import { useState } from "react";
import { useRecordingsList } from "../recordings/useRecordingsList";
import { RecordingRow } from "../recordings/RecordingRow";
import {
  filterAndSortRecordings,
  type RecordingsFilter,
} from "../recordings/filterAndSortRecordings";

const initialFilter: RecordingsFilter = {
  status: "alle",
  rating: "alle",
  sortBy: "keine",
};

export function RecordingsDashboard() {
  const { state, updateError, updateRecordingFields } = useRecordingsList();
  const [filter, setFilter] = useState<RecordingsFilter>(initialFilter);

  return (
    <div className="min-h-screen bg-onilo-background flex flex-col items-center gap-6 p-6">
      <h1 className="text-onilo-primary text-3xl font-bold">
        Recordings-Dashboard
      </h1>

      {updateError && (
        <p role="alert" className="text-onilo-accent text-lg">
          Eine Änderung konnte nicht gespeichert werden. Bitte versuche es
          erneut.
        </p>
      )}
      {state.status === "loading" && (
        <p role="status" className="text-onilo-primary text-lg">
          Recordings werden geladen…
        </p>
      )}

      {state.status === "error" && (
        <p role="alert" className="text-onilo-accent text-lg">
          Recordings konnten nicht geladen werden. Bitte versuche es erneut.
        </p>
      )}

      {state.status === "ready" && (
        <>
          <div className="flex w-full max-w-3xl items-center gap-4">
            <label className="flex items-center gap-2 text-onilo-primary">
              Status
              <select
                value={filter.status}
                onChange={(event) =>
                  setFilter((current) => ({
                    ...current,
                    status: event.target.value as RecordingsFilter["status"],
                  }))
                }
                className="rounded-lg border border-onilo-primary/30 bg-white px-2 py-1"
              >
                <option value="alle">Alle</option>
                <option value="unbewertet">Unbewertet</option>
                <option value="normal">Normal</option>
                <option value="bestanden">Bestanden</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-onilo-primary">
              Sortierung
              <select
                value={filter.sortBy}
                onChange={(event) =>
                  setFilter((current) => ({
                    ...current,
                    sortBy: event.target.value as RecordingsFilter["sortBy"],
                  }))
                }
                className="rounded-lg border border-onilo-primary/30 bg-white px-2 py-1"
              >
                <option value="keine">Keine</option>
                <option value="rating-aufsteigend">Rating aufsteigend</option>
                <option value="rating-absteigend">Rating absteigend</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-onilo-primary">
              Bewertung
              <select
                value={filter.rating}
                onChange={(event) =>
                  setFilter((current) => ({
                    ...current,
                    rating:
                      event.target.value === "alle"
                        ? "alle"
                        : (Number(event.target.value) as 1 | 2 | 3 | 4 | 5),
                  }))
                }
                className="rounded-lg border border-onilo-primary/30 bg-white px-2 py-1"
              >
                <option value="alle">Alle</option>
                <option value="1">1 Stern</option>
                <option value="2">2 Sterne</option>
                <option value="3">3 Sterne</option>
                <option value="4">4 Sterne</option>
                <option value="5">5 Sterne</option>
              </select>
            </label>
          </div>

          <div className="flex w-full max-w-3xl flex-col gap-4">
            {filterAndSortRecordings(state.recordings, filter).map(
              (recording) => (
                <RecordingRow
                  key={recording.recordingId}
                  recording={recording}
                  onStatusChange={(recordingId, status) =>
                    updateRecordingFields(recordingId, { status })
                  }
                  onRatingChange={(recordingId, rating) =>
                    updateRecordingFields(recordingId, { rating })
                  }
                  onCommentChange={(recordingId, comment) =>
                    updateRecordingFields(recordingId, { comment })
                  }
                />
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}
