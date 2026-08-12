# Boardstory-Player

Ein clientseitiger Player für animierte, vertonte Bilderbücher, mit dem Grundschulkinder (6–10) Boardstorys ansehen und dazu selbst vorlesen können; Lehrkräfte bewerten die entstandenen Aufnahmen.

## Language

**Boardstory**:
Ein animiertes, vertontes Bilderbuch als Video — der zentrale Inhaltstyp der App. Wird im Editor hochgeladen und im Player abgespielt.
_Avoid_: Video (zu generisch — "Video" ist das technische Trägerformat, "Boardstory" der fachliche Inhalt), Story, Bilderbuch.

**Cue-Point**:
Ein Zeitstempel innerhalb einer Boardstory, der eine Kapitelgrenze markiert. Wird automatisch in festen Intervallen aus der Videodauer generiert (nicht manuell gesetzt), siehe [ADR-0004](./docs/adr/0004-auto-generated-cue-points.md). Steuert die Vor/Zurück-Navigation im Player.
_Avoid_: Marker, Kapitel (Kapitel ist der Abschnitt *zwischen* zwei Cue-Points, nicht der Zeitstempel selbst), Seek-Point.

**Recording**:
Eine Audioaufnahme, in der ein Kind eine Boardstory vorliest, erstellt im Player und einer `videoId` zugeordnet. Trägt den selbst eingegebenen Namen des Kindes (siehe [ADR-0005](./docs/adr/0005-shared-device-student-identity.md)) sowie eine Bewertung, die eine Lehrkraft im Recordings-Dashboard vergibt.
_Avoid_: Aufnahme (im Fließtext ok, als Fachbegriff aber "Recording"), Audio, Take.

**Bewertung**:
Die Einschätzung, die eine Lehrkraft einem Recording im Recordings-Dashboard gibt: ein Sterne-Rating (1–5, `null` solange unbewertet) plus ein optionales Freitext-Kommentarfeld. Rein internes Lehrkraft-Tool, vom Kind nicht einsehbar.
_Avoid_: Status (frühere, verworfene Variante mit drei Zuständen unbewertet/normal/bestanden), Rating (nur die Sterne-Komponente, nicht die gesamte Bewertung).

**Status** (eines Recordings):
Der Bewertungszustand, den eine Lehrkraft einem Recording zuweist: `unbewertet` (Default, noch nicht angehört), `normal` (angehört, keine besondere Auszeichnung), `bestanden` (angehört, positiv bewertet).
_Avoid_: Rating, Bewertung (Bewertung ist die Handlung, Status das Ergebnis).

**Editor**:
Die Route (`/editor`), auf der eine Boardstory als lokale Videodatei hochgeladen wird. Kein inhaltlicher Bearbeitungs-Editor (kein Schnitt, keine Marker-UI) — beschränkt auf Upload.
_Avoid_: Upload-Seite.

**Player**:
Die Route (`/player/:videoId`), die eine Boardstory abspielt, kapitelweise Navigation über Cue-Points anbietet und die Recording-Funktion bereitstellt.

**Recordings-Dashboard**:
Die Route (`/recordings`), auf der Lehrkräfte vorhandene Recordings anhören und ihren Status setzen.
_Avoid_: Lehrer-Dashboard, Bewertungsseite.
