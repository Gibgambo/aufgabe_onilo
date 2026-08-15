import { ghostControlButtonClass } from "./playerStyles";
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
        className={ghostControlButtonClass}
        aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
      >
        {isRecording ? (
          <StopIcon className="h-7 w-7" />
        ) : (
          <MicIcon className="h-7 w-7" />
        )}
      </button>
      <RecordingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmStart}
      />
    </>
  );
}
