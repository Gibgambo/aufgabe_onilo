import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecordingsDashboard } from "./RecordingsDashboard";
import * as useRecordingsListModule from "../recordings/useRecordingsList";
import type { RecordingRecord } from "../persistence/db";

function makeRecording(
  overrides: Partial<RecordingRecord> = {},
): RecordingRecord {
  return {
    recordingId: "rec-1",
    videoId: "video-1",
    studentName: "Tim",
    blob: new Blob(["audio"], { type: "audio/webm" }),
    status: "unbewertet",
    rating: null,
    comment: null,
    ...overrides,
  };
}

describe("RecordingsDashboard", () => {
  it("zeigt einen Ladehinweis, während die Recordings geladen werden", () => {
    vi.spyOn(useRecordingsListModule, "useRecordingsList").mockReturnValue({
      state: { status: "loading" },
      updateError: false,
      updateRecordingFields: vi.fn(),
    });

    render(<RecordingsDashboard />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Recordings werden geladen",
    );
  });

  it("zeigt alle Recordings an und filtert nach Auswahl auf den gewählten Status", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const recordings = [
      makeRecording({
        recordingId: "rec-1",
        studentName: "Mia",
        status: "unbewertet",
      }),
      makeRecording({
        recordingId: "rec-2",
        studentName: "Tom",
        status: "bestanden",
      }),
    ];
    vi.spyOn(useRecordingsListModule, "useRecordingsList").mockReturnValue({
      state: { status: "ready", recordings },
      updateError: false,
      updateRecordingFields: vi.fn(),
    });
    const user = userEvent.setup();

    render(<RecordingsDashboard />);

    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.getByText("Tom")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Status"), "bestanden");

    expect(screen.queryByText("Mia")).not.toBeInTheDocument();
    expect(screen.getByText("Tom")).toBeInTheDocument();
  });

  it("leitet eine Statusänderung einer Zeile an updateRecordingFields weiter", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const updateRecordingFields = vi.fn();
    vi.spyOn(useRecordingsListModule, "useRecordingsList").mockReturnValue({
      state: {
        status: "ready",
        recordings: [
          makeRecording({ recordingId: "rec-1", status: "unbewertet" }),
        ],
      },
      updateError: false,
      updateRecordingFields,
    });
    const user = userEvent.setup();

    render(<RecordingsDashboard />);
    await user.click(screen.getByRole("button", { name: "Bestanden" }));

    expect(updateRecordingFields).toHaveBeenCalledWith("rec-1", {
      status: "bestanden",
    });
  });

  it("zeigt eine Fehlermeldung, wenn eine Änderung nicht gespeichert werden konnte", () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(useRecordingsListModule, "useRecordingsList").mockReturnValue({
      state: { status: "ready", recordings: [makeRecording()] },
      updateError: true,
      updateRecordingFields: vi.fn(),
    });

    render(<RecordingsDashboard />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "konnte nicht gespeichert werden",
    );
  });

  it("filtert nach Auswahl auf das gewählte Rating", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const recordings = [
      makeRecording({ recordingId: "rec-1", studentName: "Mia", rating: 3 }),
      makeRecording({ recordingId: "rec-2", studentName: "Tom", rating: 5 }),
    ];
    vi.spyOn(useRecordingsListModule, "useRecordingsList").mockReturnValue({
      state: { status: "ready", recordings },
      updateError: false,
      updateRecordingFields: vi.fn(),
    });
    const user = userEvent.setup();

    render(<RecordingsDashboard />);
    await user.selectOptions(screen.getByLabelText("Bewertung"), "5 Sterne");

    expect(screen.queryByText("Mia")).not.toBeInTheDocument();
    expect(screen.getByText("Tom")).toBeInTheDocument();
  });
});
