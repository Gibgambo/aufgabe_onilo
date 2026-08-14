import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  it("zeigt studentName eines Recordings an", () => {
    render(
      <RecordingRow
        recording={makeRecording({ studentName: "Mia" })}
        onStatusChange={vi.fn()}
        onRatingChange={vi.fn()}
        onCommentChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Mia")).toBeInTheDocument();
  });

  it("rendert einen abspielbaren Inline-Player für das Recording", () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

    const { container } = render(
      <RecordingRow
        recording={makeRecording()}
        onStatusChange={vi.fn()}
        onRatingChange={vi.fn()}
        onCommentChange={vi.fn()}
      />,
    );

    const audio = container.querySelector("audio");
    expect(audio).not.toBeNull();
    expect(audio).toHaveAttribute("controls");
    expect(audio?.src).toMatch(/^blob:/);
  });

  it("meldet einen Statuswechsel mit recordingId und neuem Status zurück", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    render(
      <RecordingRow
        recording={makeRecording({
          recordingId: "rec-1",
          status: "unbewertet",
        })}
        onStatusChange={onStatusChange}
        onRatingChange={vi.fn()}
        onCommentChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Unbewertet" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Bestanden" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "Bestanden" }));

    expect(onStatusChange).toHaveBeenCalledWith("rec-1", "bestanden");
  });

  it("zeigt das aktuelle Rating als gefüllte Sterne an", () => {
    render(
      <RecordingRow
        recording={makeRecording({ rating: 3 })}
        onStatusChange={vi.fn()}
        onRatingChange={vi.fn()}
        onCommentChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "3 Sterne" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "4 Sterne" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("meldet einen Rating-Klick mit recordingId und gewähltem Wert zurück", async () => {
    const user = userEvent.setup();
    const onRatingChange = vi.fn();
    render(
      <RecordingRow
        recording={makeRecording({ recordingId: "rec-1", rating: null })}
        onStatusChange={vi.fn()}
        onRatingChange={onRatingChange}
        onCommentChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "4 Sterne" }));

    expect(onRatingChange).toHaveBeenCalledWith("rec-1", 4);
  });

  it("zeigt den bestehenden Kommentar im Textfeld an", () => {
    render(
      <RecordingRow
        recording={makeRecording({ comment: "Sehr flüssig gelesen" })}
        onStatusChange={vi.fn()}
        onRatingChange={vi.fn()}
        onCommentChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Kommentar")).toHaveValue(
      "Sehr flüssig gelesen",
    );
  });

  it("meldet einen geänderten Kommentar beim Verlassen des Felds zurück", async () => {
    const user = userEvent.setup();
    const onCommentChange = vi.fn();
    render(
      <RecordingRow
        recording={makeRecording({ recordingId: "rec-1", comment: null })}
        onStatusChange={vi.fn()}
        onRatingChange={vi.fn()}
        onCommentChange={onCommentChange}
      />,
    );

    const textarea = screen.getByLabelText("Kommentar");
    await user.type(textarea, "Toll gemacht");
    await user.tab();

    expect(onCommentChange).toHaveBeenCalledWith("rec-1", "Toll gemacht");
  });
});
