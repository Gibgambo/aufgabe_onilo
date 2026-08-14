import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "./AppRoutes";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("Routing-Skelett", () => {
  it("rendert Editor auf /editor", async () => {
    renderAt("/editor");
    expect(
      await screen.findByRole("heading", { name: "Editor" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editor" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });

  it("rendert Player auf /player/:videoId", async () => {
    renderAt("/player/abc123");
    expect(
      await screen.findByRole("heading", { name: "Player" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editor" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });

  it("rendert Recordings-Dashboard auf /recordings", async () => {
    renderAt("/recordings");
    expect(
      await screen.findByRole("heading", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editor" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });
});
