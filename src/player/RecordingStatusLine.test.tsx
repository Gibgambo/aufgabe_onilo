import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecordingStatusLine } from "./RecordingStatusLine";

describe("RecordingStatusLine", () => {
  it("zeigt einen Hinweis, während auf die Mikrofon-Freigabe gewartet wird", () => {
    render(
      <RecordingStatusLine state={{ status: "requesting-permission" }} />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Warte auf Mikrofon-Freigabe",
    );
  });

  it("zeigt einen Hinweis während der Aufnahme", () => {
    render(<RecordingStatusLine state={{ status: "recording" }} />);

    expect(screen.getByRole("status")).toHaveTextContent("Aufnahme läuft");
  });

  it("zeigt eine Erfolgsmeldung nach dem Speichern", () => {
    render(
      <RecordingStatusLine
        state={{ status: "saved", recordingId: "rec-1" }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Aufnahme gespeichert",
    );
  });

  it("zeigt eine Fehlermeldung bei verweigerter Mikrofon-Erlaubnis", () => {
    render(<RecordingStatusLine state={{ status: "permission-denied" }} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Mikrofon-Zugriff wurde verweigert",
    );
  });

  it("zeigt eine Fehlermeldung bei einem Speicherfehler", () => {
    render(<RecordingStatusLine state={{ status: "error" }} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Die Aufnahme konnte nicht gespeichert werden",
    );
  });

  it("zeigt nichts im idle-Zustand", () => {
    render(<RecordingStatusLine state={{ status: "idle" }} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
