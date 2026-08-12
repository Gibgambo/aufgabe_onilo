# Architecture Decision Records

Kurzübersicht aller ADRs. Details jeweils in der verlinkten Datei.

| # | Entscheidung | Kurzbegründung |
|---|---|---|
| [0001](./0001-client-side-only-no-backend.md) | Rein clientseitig, kein Backend | Aufgabenstellung deutet auf lokale Bereitstellung hin; kein Server-Risiko im 3-Tage-Rahmen; alle Pflichtfunktionen ohne Server demonstrierbar |
| [0002](./0002-react-vite-frontend.md) | React + Vite (statt Svelte + Vite) | Svelte wäre technisch besser für schwache Schul-Hardware (~3x kleineres Bundle), aber React-Vertrautheit + größeres Ökosystem senken das Zeitrisiko in 3 Tagen stärker |
| [0003](./0003-video-state-handoff-indexeddb-url-param.md) | Video-Handoff via URL-Param + IndexedDB, kein globaler Store | Einziger routenübergreifender State ist eine ID — gehört in die URL, nicht in Zustand/Context; Blob in IndexedDB übersteht Reload |
