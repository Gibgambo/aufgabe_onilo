import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecordingRow } from "./RecordingRow";
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

describe("RecordingRow", () => {
  it("zeigt studentName, Status, Rating und Kommentar eines Recordings an", () => {
    render(
      <RecordingRow
        recording={makeRecording({
          studentName: "Mia",
          status: "bestanden",
          rating: 4,
          comment: "Sehr flüssig gelesen",
        })}
      />,
    );

    expect(screen.getByText("Mia")).toBeInTheDocument();
    expect(screen.getByText("Bestanden")).toBeInTheDocument();
    expect(screen.getByText("Bewertung: 4")).toBeInTheDocument();
    expect(
      screen.getByText("Kommentar: Sehr flüssig gelesen"),
    ).toBeInTheDocument();
  });

  it("zeigt einen Platzhalter, solange Rating und Kommentar noch nicht gesetzt sind", () => {
    render(
      <RecordingRow
        recording={makeRecording({ rating: null, comment: null })}
      />,
    );

    expect(screen.getByText("Bewertung: –")).toBeInTheDocument();
    expect(screen.getByText("Kommentar: –")).toBeInTheDocument();
  });

  it("rendert einen abspielbaren Inline-Player für das Recording", () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

    const { container } = render(<RecordingRow recording={makeRecording()} />);

    const audio = container.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio).toHaveAttribute("controls");
    expect(audio?.src).toMatch(/^blob:/);
  });
});
