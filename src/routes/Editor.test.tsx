import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Editor } from "./Editor";
import * as uploadBoardstoryModule from "../editor/uploadBoardstory";
import * as useVideosListModule from "../editor/useVideosList";
import type { VideoRecord } from "../persistence/db";

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

function makeVideo(overrides: Partial<VideoRecord> = {}): VideoRecord {
  return {
    videoId: "video-1",
    name: "Boardstory A",
    mimeType: "video/mp4",
    uploadedAt: "2026-01-01T10:00:00.000Z",
    blob: new Blob(["video"], { type: "video/mp4" }),
    cuePoints: [],
    ...overrides,
  };
}

describe("Editor – Boardstory-Liste", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("zeigt einen Hinweistext, wenn noch keine Boardstory hochgeladen wurde", () => {
    vi.spyOn(useVideosListModule, "useVideosList").mockReturnValue({
      status: "ready",
      videos: [],
    });

    renderEditor();

    expect(
      screen.getByText("Noch keine Boardstory hochgeladen."),
    ).toBeInTheDocument();
  });

  it("zeigt Name und Datum jeder hochgeladenen Boardstory", () => {
    vi.spyOn(useVideosListModule, "useVideosList").mockReturnValue({
      status: "ready",
      videos: [makeVideo({ name: "Meine Boardstory" })],
    });

    renderEditor();

    expect(screen.getByText("Meine Boardstory")).toBeInTheDocument();
    expect(screen.getByText("1.1.2026")).toBeInTheDocument();
  });

  it("navigiert zum Player der jeweiligen Boardstory bei Klick auf eine Zeile", async () => {
    vi.spyOn(useVideosListModule, "useVideosList").mockReturnValue({
      status: "ready",
      videos: [makeVideo({ videoId: "video-42", name: "Meine Boardstory" })],
    });
    const user = userEvent.setup({ applyAccept: false });

    renderEditor();
    await user.click(screen.getByText("Meine Boardstory"));

    expect(await screen.findByText("Player-Seite")).toBeInTheDocument();
  });
});

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
