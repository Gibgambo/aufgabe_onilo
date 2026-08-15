import { useState } from "react";
import { useRecording } from "./useRecording";
import type { RecordingState } from "./useRecording";

export interface RecordingControlValue {
  state: RecordingState;
  isRecording: boolean;
  isModalOpen: boolean;
  isButtonDisabled: boolean;
  closeModal: () => void;
  confirmStart: (studentName: string) => void;
  handleButtonClick: () => void;
}

export function useRecordingControl(videoId: string): RecordingControlValue {
  const { state, start, stop } = useRecording(videoId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isRecording = state.status === "recording";
  const isButtonDisabled =
    !isRecording &&
    (state.status === "requesting-permission" || state.status === "saving");

  function closeModal() {
    setIsModalOpen(false);
  }

  function confirmStart(studentName: string) {
    setIsModalOpen(false);
    start(studentName);
  }

  function handleButtonClick() {
    if (isRecording) {
      stop();
    } else {
      setIsModalOpen(true);
    }
  }

  return {
    state,
    isRecording,
    isModalOpen,
    isButtonDisabled,
    closeModal,
    confirmStart,
    handleButtonClick,
  };
}
