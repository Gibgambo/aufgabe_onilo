import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Editor } from "./Editor";
import * as db from "../persistence/db";
import * as videoDuration from "../editor/videoDuration";

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

  it("speichert das Video mit Cue-Points und navigiert zum Player", async () => {
    vi.spyOn(videoDuration, "getVideoDuration").mockResolvedValue(100);
    vi.spyOn(db, "saveVideo").mockResolvedValue("video-123");
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(await screen.findByText("Player-Seite")).toBeInTheDocument();
    expect(db.saveVideo).toHaveBeenCalledWith({
      name: "boardstory.mp4",
      mimeType: "video/mp4",
      blob: expect.any(File),
      cuePoints: [0, 25, 50, 75],
    });
  });

  it("zeigt einen Ladezustand, während der Upload läuft", async () => {
    let resolveDuration: (value: number) => void = () => {};
    vi.spyOn(videoDuration, "getVideoDuration").mockReturnValue(
      new Promise((resolve) => {
        resolveDuration = resolve;
      }),
    );
    vi.spyOn(db, "saveVideo").mockResolvedValue("video-123");
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "wird hochgeladen",
    );

    resolveDuration(50);
    expect(await screen.findByText("Player-Seite")).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung und navigiert nicht, wenn das Speichern fehlschlägt", async () => {
    vi.spyOn(videoDuration, "getVideoDuration").mockResolvedValue(100);
    vi.spyOn(db, "saveVideo").mockRejectedValue(new Error("Quota exceeded"));
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    const input = screen.getByLabelText("Boardstory hochladen");
    await user.upload(input, makeFile("boardstory.mp4", "video/mp4"));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Player-Seite")).not.toBeInTheDocument();
  });
});
