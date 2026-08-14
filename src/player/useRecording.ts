import { useEffect, useRef, useState } from "react";
import { saveRecording } from "../persistence/db";

export type RecordingState =
  | { status: "idle" }
  | { status: "requesting-permission" }
  | { status: "recording" }
  | { status: "saving" }
  | { status: "saved"; recordingId: string }
  | { status: "permission-denied" }
  | { status: "error" };

export interface UseRecordingResult {
  state: RecordingState;
  start: (studentName: string) => void;
  stop: () => void;
}

function stopTracks(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop());
}

export function useRecording(videoId: string): UseRecordingResult {
  const [state, setState] = useState<RecordingState>({ status: "idle" });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const studentNameRef = useRef("");
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      const recorder = mediaRecorderRef.current;
      if (recorder) {
        // stoppt die Tracks direkt statt recorder.stop(), sonst würde der
        // Browser onstop weiterhin automatisch feuern, sobald der Stream
        // inaktiv wird — und saveChunks() liefe trotzdem noch
        recorder.onstop = null;
        stopTracks(recorder.stream);
      }
    };
  }, []);

  async function saveChunks() {
    setState({ status: "saving" });
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    try {
      const recordingId = await saveRecording({
        videoId,
        studentName: studentNameRef.current,
        blob,
      });
      setState({ status: "saved", recordingId });
    } catch (saveError) {
      console.error("Recording konnte nicht gespeichert werden", saveError);
      setState({ status: "error" });
    }
  }

  function createRecorder(stream: MediaStream): MediaRecorder {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      stopTracks(stream);
      void saveChunks();
    };
    return mediaRecorder;
  }

  async function start(studentName: string) {
    studentNameRef.current = studentName;
    setState({ status: "requesting-permission" });

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (permissionError) {
      console.error("Mikrofon-Zugriff verweigert", permissionError);
      setState({ status: "permission-denied" });
      return;
    }

    if (!isMountedRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    chunksRef.current = [];
    mediaRecorderRef.current = createRecorder(stream);
    mediaRecorderRef.current.start();
    setState({ status: "recording" });
  }

  function stop() {
    mediaRecorderRef.current?.stop();
  }

  return { state, start, stop };
}
