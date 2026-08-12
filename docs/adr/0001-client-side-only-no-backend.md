# Client-side only, no backend

Der Boardstory-Player ist ein 3-Tage-Prototyp ohne Mehrbenutzer- oder Cross-Device-Anforderung. Hochgeladene Videos werden per `URL.createObjectURL()` direkt im Browser für die Wiedergabe bereitgestellt, Schüleraufnahmen werden als Blob in IndexedDB persistiert (überlebt Reloads, im Gegensatz zu reinem In-Memory-State). Es gibt keinen Server, der Dateien speichert oder verarbeitet.

**Considered:** Ein kleiner Server (z. B. Elixir/Phoenix), der Video-Uploads und Aufnahmen tatsächlich persistiert. Verworfen, weil die Aufgabenstellung explizit auf lokale Bereitstellung im Browser hindeutet („Die Datei wird direkt für die Wiedergabe im Player bereitgestellt"), ein Server im 3-Tage-Rahmen zusätzliches Infrastruktur- und Deployment-Risiko bedeutet, und alle Pflichtfunktionen ohne Server vollständig demonstrierbar sind.

**Consequence:** Keine Persistenz über Geräte/Browser-Profile hinweg, keine echte Mehrbenutzer-Situation. Falls das Produkt darüber hinauswächst, ist dies der Punkt, an dem ein Backend nachgezogen werden müsste (Video-Storage, Aufnahmen-Storage, Auth für Lehrkräfte) — Elixir/Phoenix wäre dafür ein naheliegender Kandidat, u. a. wegen der guten Eignung für Echtzeit-/Concurrency-lastige Szenarien (z. B. viele gleichzeitige Uploads).
