import { useRef, useState } from "react";
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

export function useRecording(videoId: string): UseRecordingResult {
  const [state, setState] = useState<RecordingState>({ status: "idle" });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const studentNameRef = useRef("");

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

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      void saveChunks();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setState({ status: "recording" });
  }

  function stop() {
    mediaRecorderRef.current?.stop();
  }

  return { state, start, stop };
}
