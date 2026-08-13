import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Editor } from "./Editor";

function makeFile(name: string, type: string): File {
  return new File(["fake-content"], name, { type });
}

describe("Editor", () => {
  it("zeigt eine Fehlermeldung bei nicht unterstütztem Videoformat", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Editor />);
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("dokument.pdf", "application/pdf"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Dieses Videoformat wird nicht unterstützt",
    );
  });

  it("zeigt keine Fehlermeldung bei einer gültigen MP4-Datei", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Editor />);
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("löscht eine vorherige Fehlermeldung, wenn danach eine gültige Datei gewählt wird", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Editor />);
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("dokument.pdf", "application/pdf"));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
