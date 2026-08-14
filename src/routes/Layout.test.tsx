import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

function renderLayoutAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout />
    </MemoryRouter>,
  );
}

describe("Layout", () => {
  it("zeigt Nav-Links zu Editor und Recordings-Dashboard", () => {
    renderLayoutAt("/editor");
    expect(screen.getByRole("link", { name: "Editor" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });

  it("hebt den Editor-Link hervor, wenn der Pfad /editor ist", () => {
    renderLayoutAt("/editor");
    expect(screen.getByRole("link", { name: "Editor" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("hebt den Recordings-Dashboard-Link hervor, wenn der Pfad /recordings ist", () => {
    renderLayoutAt("/recordings");
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Editor" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("markiert keinen Link als aktiv auf /player/:videoId", () => {
    renderLayoutAt("/player/abc123");
    expect(screen.getByRole("link", { name: "Editor" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByRole("link", { name: "Recordings-Dashboard" }),
    ).not.toHaveAttribute("aria-current");
  });
});
