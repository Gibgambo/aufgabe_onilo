import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { routeDefinitions } from "./routeDefinitions";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Suspense fallback={null}>
        <Routes>
          {routeDefinitions.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </MemoryRouter>,
  );
}

describe("Routing-Skelett", () => {
  it("rendert Editor auf /editor", async () => {
    renderAt("/editor");
    expect(
      await screen.findByRole("heading", { name: "Editor" }),
    ).toBeInTheDocument();
  });

  it("rendert Player auf /player/:videoId", async () => {
    renderAt("/player/abc123");
    expect(
      await screen.findByRole("heading", { name: "Player" }),
    ).toBeInTheDocument();
  });

  it("rendert Recordings-Dashboard auf /recordings", async () => {
    renderAt("/recordings");
    expect(
      await screen.findByRole("heading", { name: "Recordings-Dashboard" }),
    ).toBeInTheDocument();
  });
});
