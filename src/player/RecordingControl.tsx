import { recordButtonClass, stopButtonClass } from "./playerStyles";
import { MicIcon, StopIcon } from "./icons";
import { RecordingModal } from "./RecordingModal";
import type { RecordingControlValue } from "./useRecordingControl";

export function RecordingControl({
  isRecording,
  isModalOpen,
  isButtonDisabled,
  closeModal,
  confirmStart,
  handleButtonClick,
}: RecordingControlValue) {
  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={isRecording ? stopButtonClass : recordButtonClass}
        aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
      >
        {isRecording ? (
          <StopIcon className="h-5 w-5" />
        ) : (
          <MicIcon className="h-5 w-5" />
        )}
        {isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
      </button>
      <RecordingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmStart}
      />
    </>
  );
}
