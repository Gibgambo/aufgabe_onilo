import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecordingPanel } from "./Player";
import * as useRecordingModule from "../player/useRecording";
import type { RecordingState } from "../player/useRecording";

function mockRecordingState(state: RecordingState) {
  const start = vi.fn();
  const stop = vi.fn();
  vi.spyOn(useRecordingModule, "useRecording").mockReturnValue({
    state,
    start,
    stop,
  });
  return { start, stop };
}

describe("RecordingPanel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hält den Aufnahme-Button deaktiviert, solange kein Name eingegeben wurde", () => {
    mockRecordingState({ status: "idle" });
    render(<RecordingPanel videoId="video-1" />);

    expect(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    ).toBeDisabled();
  });

  it("aktiviert den Aufnahme-Button, sobald ein Name eingegeben wurde", async () => {
    mockRecordingState({ status: "idle" });
    const user = userEvent.setup();
    render(<RecordingPanel videoId="video-1" />);

    await user.type(screen.getByLabelText("Wie lautet dein Name?"), "Tim");

    expect(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    ).toBeEnabled();
  });

  it("startet die Aufnahme mit dem eingegebenen Namen", async () => {
    const { start } = mockRecordingState({ status: "idle" });
    const user = userEvent.setup();
    render(<RecordingPanel videoId="video-1" />);

    await user.type(screen.getByLabelText("Wie lautet dein Name?"), "Tim");
    await user.click(screen.getByRole("button", { name: "Aufnahme starten" }));

    expect(start).toHaveBeenCalledWith("Tim");
  });

  it("zeigt einen visuellen Indikator während der Aufnahme und stoppt per Klick", async () => {
    const { stop } = mockRecordingState({ status: "recording" });
    const user = userEvent.setup();
    render(<RecordingPanel videoId="video-1" />);

    expect(screen.getByRole("status")).toHaveTextContent("Aufnahme läuft");

    await user.click(screen.getByRole("button", { name: "Aufnahme stoppen" }));

    expect(stop).toHaveBeenCalled();
  });

  it("zeigt eine verständliche Fehlermeldung bei verweigerter Mikrofon-Erlaubnis", () => {
    mockRecordingState({ status: "permission-denied" });
    render(<RecordingPanel videoId="video-1" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Mikrofon-Zugriff wurde verweigert",
    );
  });
});
