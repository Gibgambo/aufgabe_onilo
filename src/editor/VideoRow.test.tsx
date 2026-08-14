import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { VideoRow } from "./VideoRow";
import type { VideoRecord } from "../persistence/db";

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

describe("VideoRow", () => {
  it("zeigt Name und formatiertes Upload-Datum an", () => {
    render(
      <MemoryRouter>
        <VideoRow video={makeVideo({ name: "Meine Boardstory" })} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Meine Boardstory")).toBeInTheDocument();
    expect(screen.getByText("1.1.2026")).toBeInTheDocument();
  });

  it("verlinkt die ganze Zeile zum Player der Boardstory", () => {
    render(
      <MemoryRouter>
        <VideoRow video={makeVideo({ videoId: "video-42" })} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/player/video-42",
    );
  });
});
