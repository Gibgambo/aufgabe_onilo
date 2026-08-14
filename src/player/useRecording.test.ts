import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRecording } from "./useRecording";
import * as dbModule from "../persistence/db";

class FakeMediaRecorder {
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  stream: MediaStream;

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  start() {}

  stop() {
    this.ondataavailable?.({ data: new Blob(["audio-chunk"]) });
    this.onstop?.();
  }
}

function makeFakeStream(): MediaStream {
  const track = { stop: vi.fn() };
  return { getTracks: () => [track] } as unknown as MediaStream;
}

function stubGetUserMedia() {
  const getUserMedia = vi.fn();
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia },
    configurable: true,
    writable: true,
  });
  return getUserMedia;
}

describe("useRecording", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("startet im Status idle", () => {
    const { result } = renderHook(() => useRecording("video-1"));

    expect(result.current.state.status).toBe("idle");
  });

  it("wechselt zu recording, nachdem die Mikrofon-Erlaubnis erteilt wurde", async () => {
    vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
    const getUserMedia = stubGetUserMedia();
    getUserMedia.mockResolvedValue(makeFakeStream());

    const { result } = renderHook(() => useRecording("video-1"));
    await act(async () => {
      result.current.start("Tim");
    });

    await waitFor(() => expect(result.current.state.status).toBe("recording"));
  });

  it("speichert das Recording über saveRecording, wenn stop() aufgerufen wird", async () => {
    vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
    const getUserMedia = stubGetUserMedia();
    getUserMedia.mockResolvedValue(makeFakeStream());
    const saveRecordingSpy = vi
      .spyOn(dbModule, "saveRecording")
      .mockResolvedValue("recording-1");

    const { result } = renderHook(() => useRecording("video-1"));
    await act(async () => {
      result.current.start("Tim");
    });
    await waitFor(() => expect(result.current.state.status).toBe("recording"));

    act(() => {
      result.current.stop();
    });

    await waitFor(() => expect(result.current.state.status).toBe("saved"));
    expect(saveRecordingSpy).toHaveBeenCalledWith({
      videoId: "video-1",
      studentName: "Tim",
      blob: expect.any(Blob),
    });
  });

  it("liefert permission-denied, wenn die Mikrofon-Erlaubnis verweigert wird", async () => {
    const permissionError = new Error("Permission denied");
    const getUserMedia = stubGetUserMedia();
    getUserMedia.mockRejectedValue(permissionError);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useRecording("video-1"));
    await act(async () => {
      result.current.start("Tim");
    });

    await waitFor(() =>
      expect(result.current.state.status).toBe("permission-denied"),
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Mikrofon-Zugriff verweigert",
      permissionError,
    );
  });

  it("stoppt die Mikrofon-Tracks und verwirft die Chunks, wenn während der Aufnahme unmounted wird", async () => {
    vi.stubGlobal("MediaRecorder", FakeMediaRecorder);
    const getUserMedia = stubGetUserMedia();
    const stream = makeFakeStream();
    getUserMedia.mockResolvedValue(stream);
    const saveRecordingSpy = vi.spyOn(dbModule, "saveRecording");

    const { result, unmount } = renderHook(() => useRecording("video-1"));
    await act(async () => {
      result.current.start("Tim");
    });
    await waitFor(() => expect(result.current.state.status).toBe("recording"));

    unmount();

    const [track] = stream.getTracks();
    expect(track.stop).toHaveBeenCalled();
    expect(saveRecordingSpy).not.toHaveBeenCalled();
  });
});
