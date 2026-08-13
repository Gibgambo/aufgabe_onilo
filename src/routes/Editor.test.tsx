import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Editor } from "./Editor";
import * as uploadBoardstoryModule from "../editor/uploadBoardstory";

function makeFile(name: string, type: string): File {
  return new File(["fake-content"], name, { type });
}

function renderEditor() {
  return render(
    <MemoryRouter initialEntries={["/editor"]}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/player/:videoId" element={<div>Player-Seite</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Editor", () => {
  it("zeigt eine Fehlermeldung bei nicht unterstütztem Videoformat", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("dokument.pdf", "application/pdf"));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Dieses Videoformat wird nicht unterstützt",
    );
  });

  it("zeigt keine Fehlermeldung bei einer gültigen MP4-Datei", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("löscht eine vorherige Fehlermeldung, wenn danach eine gültige Datei gewählt wird", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");

    await user.upload(input, makeFile("dokument.pdf", "application/pdf"));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("Editor – Upload-Flow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigiert zum Player, sobald uploadBoardstory eine videoId liefert", async () => {
    vi.spyOn(uploadBoardstoryModule, "uploadBoardstory").mockResolvedValue(
      "video-123",
    );
    const user = userEvent.setup({ applyAccept: false });
    const file = makeFile("boardstory.mp4", "video/mp4");

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, file);

    expect(await screen.findByText("Player-Seite")).toBeInTheDocument();
    expect(uploadBoardstoryModule.uploadBoardstory).toHaveBeenCalledWith(file);
  });

  it("zeigt einen Ladezustand, während der Upload läuft", async () => {
    let resolveUpload: (videoId: string) => void = () => {};
    vi.spyOn(uploadBoardstoryModule, "uploadBoardstory").mockReturnValue(
      new Promise((resolve) => {
        resolveUpload = resolve;
      }),
    );
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "wird hochgeladen",
    );

    resolveUpload("video-123");
    expect(await screen.findByText("Player-Seite")).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung und navigiert nicht, wenn der Upload fehlschlägt", async () => {
    const uploadError = new Error("Quota exceeded");
    vi.spyOn(uploadBoardstoryModule, "uploadBoardstory").mockRejectedValue(
      uploadError,
    );
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Player-Seite")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Boardstory-Upload fehlgeschlagen",
      uploadError,
    );
  });
});
