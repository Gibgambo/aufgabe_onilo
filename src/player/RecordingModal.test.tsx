import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecordingModal } from "./RecordingModal";

describe("RecordingModal", () => {
  it("zeigt Namensfeld und Vorlese-Hinweistext, wenn geöffnet", () => {
    render(
      <RecordingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(screen.getByLabelText("Wie lautet dein Name?")).toBeVisible();
    expect(
      screen.getByText(
        "Nimm dich beim Vorlesen auf. Deine Lehrkraft hört es sich an.",
      ),
    ).toBeVisible();
  });

  it("hält den Bestätigen-Button deaktiviert, solange kein Name eingegeben wurde", () => {
    render(
      <RecordingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Aufnahme starten" }),
    ).toBeDisabled();
  });

  it("bestätigt mit dem getrimmten Namen und schließt das Modal", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <RecordingModal isOpen onClose={vi.fn()} onConfirm={onConfirm} />,
    );

    await user.type(screen.getByLabelText("Wie lautet dein Name?"), "  Tim  ");
    await user.click(screen.getByRole("button", { name: "Aufnahme starten" }));

    expect(onConfirm).toHaveBeenCalledWith("Tim");
  });

  it("ruft onClose auf, wenn Abbrechen geklickt wird", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <RecordingModal isOpen onClose={onClose} onConfirm={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Abbrechen" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("ruft onClose auf, wenn auf das Backdrop geklickt wird", () => {
    const onClose = vi.fn();
    render(<RecordingModal isOpen onClose={onClose} onConfirm={vi.fn()} />);

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalled();
  });

  it("schließt nicht, wenn innerhalb des Modal-Inhalts geklickt wird", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<RecordingModal isOpen onClose={onClose} onConfirm={vi.fn()} />);

    await user.click(screen.getByLabelText("Wie lautet dein Name?"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("leert das Namensfeld erneut, wenn das Modal nach dem Schließen wieder geöffnet wird", () => {
    const { rerender } = render(
      <RecordingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />,
    );
    const input = screen.getByLabelText(
      "Wie lautet dein Name?",
    ) as HTMLInputElement;
    input.value = "Tim";

    rerender(
      <RecordingModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />,
    );
    rerender(
      <RecordingModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(
      (screen.getByLabelText("Wie lautet dein Name?") as HTMLInputElement)
        .value,
    ).toBe("");
  });
});
