import { useEffect, useRef, useState } from "react";
import { recordButtonClass } from "./playerStyles";
import { MicIcon } from "./icons";

export interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentName: string) => void;
}

export function RecordingModal({ isOpen, onClose, onConfirm }: RecordingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [studentName, setStudentName] = useState("");
  const [wasOpen, setWasOpen] = useState(isOpen);

  // Reset während des Renderns statt in einem Effect, damit das leere Feld
  // im selben Durchlauf steht, in dem das Modal wieder sichtbar wird.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setStudentName("");
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = studentName.trim();
    if (!trimmed) {
      return;
    }
    onConfirm(trimmed);
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="recording-modal-title"
      className="m-auto rounded-[28px] border-none bg-white p-0 shadow-xl backdrop:bg-onilo-stage/60"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-[min(90vw,26rem)] flex-col gap-5 p-7"
      >
        <div>
          <h2
            id="recording-modal-title"
            className="font-display text-onilo-primary text-xl font-semibold"
          >
            Selbst vorlesen
          </h2>
          <p className="text-onilo-primary/70 mt-1 text-sm">
            Nimm dich beim Vorlesen auf. Deine Lehrkraft hört es sich an.
          </p>
        </div>

        <label className="text-onilo-primary flex flex-col gap-1 font-medium">
          <span aria-hidden="true" className="text-onilo-primary/70 text-sm">
            Wie lautet dein Name?
          </span>
          <input
            type="text"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
            placeholder="Dein Name"
            aria-label="Wie lautet dein Name?"
            autoFocus
            className="border-onilo-primary/20 focus-visible:outline-onilo-secondary w-full rounded-2xl border-2 bg-white px-4 py-3 text-base text-black outline-none focus-visible:outline-4"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-onilo-primary px-4 py-2 font-medium"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={!studentName.trim()}
            className={recordButtonClass}
          >
            <MicIcon className="h-5 w-5" />
            Aufnahme starten
          </button>
        </div>
      </form>
    </dialog>
  );
}
