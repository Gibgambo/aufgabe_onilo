# Architecture Decision Records

Kurzübersicht aller ADRs. Details jeweils in der verlinkten Datei.

| # | Entscheidung | Kurzbegründung |
|---|---|---|
| [0001](./0001-client-side-only-no-backend.md) | Rein clientseitig, kein Backend | kein Server-Risiko im 3-Tage-Rahmen; alle Pflichtfunktionen ohne Server demonstrierbar |
| [0002](./0002-react-vite-frontend.md) | React + Vite (statt Svelte + Vite) | Svelte wäre technisch besser für schwache Schul-Hardware (~3x kleineres Bundle), aber React-Vertrautheit + größeres Ökosystem senken das Zeitrisiko in 3 Tagen stärker |
| [0003](./0003-video-state-handoff-indexeddb-url-param.md) | Video-Handoff via URL-Param + IndexedDB, kein globaler Store | Blob in IndexedDB übersteht Reload |
| [0004](./0004-auto-generated-cue-points.md) | Auto-generierte Cue-Points in festen Intervallen | feste Intervalle statt reinem Zeit-Offset für konsistente Kapitelgrenzen |
| [0005](./0005-shared-device-student-identity.md) | Schüler-Identität via Freitext-Name, ein Gerät pro Klassenzimmer | Ohne Backend keine geräteübergreifende Zusammenführung — Multi-Geräte-Szenario würde ADR-0001 widersprechen |
