import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { routeDefinitions } from "./routeDefinitions";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        {routeDefinitions.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </MemoryRouter>,
  );
}

describe("Routing-Skelett", () => {
  it("rendert Editor auf /editor", () => {
    renderAt("/editor");
    expect(screen.getByRole("heading", { name: "Editor" })).toBeInTheDocument();
  });

  it("rendert Player auf /player/:videoId", () => {
    renderAt("/player/abc123");
    expect(screen.getByRole("heading", { name: "Player" })).toBeInTheDocument();
  });

  it("rendert Recordings-Dashboard auf /recordings", () => {
    renderAt("/recordings");
    expect(
      screen.getByRole("heading", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });
});
