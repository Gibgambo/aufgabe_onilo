import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecordingControl } from "./RecordingControl";
import { useRecordingControl } from "./useRecordingControl";
import * as useRecordingModule from "./useRecording";
import type { RecordingState } from "./useRecording";

function renderControl(state: RecordingState) {
  const start = vi.fn();
  const stop = vi.fn();
  vi.spyOn(useRecordingModule, "useRecording").mockReturnValue({
    state,
    start,
    stop,
  });

  function Wrapper() {
    const recording = useRecordingControl("video-1");
    return <RecordingControl {...recording} />;
  }

  render(<Wrapper />);
  return { start, stop };
}

describe("RecordingControl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("öffnet per Klick auf den Mikro-Button das Modal mit leerem Namensfeld", async () => {
    renderControl({ status: "idle" });
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    );

    expect(screen.getByLabelText("Wie lautet dein Name?")).toBeVisible();
  });

  it("startet die Aufnahme, sobald im Modal bestätigt wird", async () => {
    const { start } = renderControl({ status: "idle" });
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    );
    await user.type(screen.getByLabelText("Wie lautet dein Name?"), "Tim");
    await user.click(
      screen.getAllByRole("button", { name: "Aufnahme starten" })[1],
    );

    expect(start).toHaveBeenCalledWith("Tim");
  });

  it("zeigt während der Aufnahme einen Stop-Button anstelle des Mikro-Buttons", async () => {
    const { stop } = renderControl({ status: "recording" });
    const user = userEvent.setup();

    expect(
      screen.queryByRole("button", { name: "Aufnahme starten" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Aufnahme stoppen" }));

    expect(stop).toHaveBeenCalled();
  });

  it("öffnet nach einem Fehler erneut das Modal mit leerem Namensfeld", async () => {
    renderControl({ status: "error" });
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    );

    expect(
      (screen.getByLabelText("Wie lautet dein Name?") as HTMLInputElement)
        .value,
    ).toBe("");
  });
});
