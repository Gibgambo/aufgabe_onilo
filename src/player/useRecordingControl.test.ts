import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRecordingControl } from "./useRecordingControl";
import * as useRecordingModule from "./useRecording";
import type { RecordingState } from "./useRecording";

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

describe("useRecordingControl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("öffnet das Modal, wenn der Button im idle-Zustand geklickt wird", () => {
    mockRecordingState({ status: "idle" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    expect(result.current.isModalOpen).toBe(false);
    act(() => {
      result.current.handleButtonClick();
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it("schließt das Modal und startet die Aufnahme mit dem bestätigten Namen", () => {
    const { start } = mockRecordingState({ status: "idle" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    act(() => {
      result.current.handleButtonClick();
    });
    act(() => {
      result.current.confirmStart("Tim");
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(start).toHaveBeenCalledWith("Tim");
  });

  it("stoppt die Aufnahme, wenn der Button während der Aufnahme geklickt wird", () => {
    const { stop } = mockRecordingState({ status: "recording" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    act(() => {
      result.current.handleButtonClick();
    });

    expect(stop).toHaveBeenCalled();
    expect(result.current.isModalOpen).toBe(false);
  });

  it("deaktiviert den Button während des Permission-Requests", () => {
    mockRecordingState({ status: "requesting-permission" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    expect(result.current.isButtonDisabled).toBe(true);
  });

  it("deaktiviert den Button während des Speicherns", () => {
    mockRecordingState({ status: "saving" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    expect(result.current.isButtonDisabled).toBe(true);
  });

  it("aktiviert den Button wieder, sobald der Status saved ist", () => {
    mockRecordingState({ status: "saved", recordingId: "rec-1" });
    const { result } = renderHook(() => useRecordingControl("video-1"));

    expect(result.current.isButtonDisabled).toBe(false);
  });
});
