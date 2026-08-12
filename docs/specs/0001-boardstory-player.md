# Spec: Boardstory-Player: Editor, Player, Recordings-Dashboard

> Issue: https://github.com/Gibgambo/aufgabe_onilo/issues/1

## Problem Statement

Onilo braucht einen funktionierenden Prototyp des neuen Boardstory-Players als Teil des Bewerbungsprozesses für die Position Full-Stack Entwickler:in. Aktuell gibt es keine verfügbare, lauffähige App — nur die Aufgabenstellung und sechs ADRs, die die zentralen Architekturentscheidungen bereits festgelegt haben (kein Backend, React+Vite, IndexedDB-basierter Video-Handoff, Auto-Cue-Points, Freitext-Schülername, Test-Last). Es fehlt die eigentliche Implementierung: eine App mit drei Routen, in der eine Lehrkraft eine Boardstory hochladen kann, ein Kind sie abspielt und dazu vorliest, und die Lehrkraft die entstandenen Recordings anschließend anhören und bewerten kann.

## Solution

Eine clientseitige React+Vite-SPA mit drei Routen (`/editor`, `/player/:videoId`, `/recordings`), die die Pflichtfunktionen aus der Aufgabenstellung erfüllt: Video-Upload, Wiedergabe mit Play/Pause, Zeitleiste, kapitelweise Vor/Zurück-Navigation über automatisch generierte Cue-Points, Lautstärke/Mute, sowie eine Aufnahmefunktion, deren Ergebnisse im Recordings-Dashboard der Lehrkraft zum Anhören und Bewerten zur Verfügung stehen. Alle Daten (Video-Blobs, Cue-Points, Recordings) werden ausschließlich clientseitig in IndexedDB persistiert — kein Server, keine Auth (ADR-0001). Design orientiert sich am Onilo-Farbschema und ist auf Grundschulkinder (6–10) zugeschnitten: große, gut klickbare Steuerelemente, klare Hierarchie, kindgerechte Typografie.

## User Stories

1. Als Lehrkraft möchte ich auf `/editor` eine lokale Videodatei hochladen können, damit ich eine Boardstory für den Unterricht bereitstellen kann.
2. Als Lehrkraft möchte ich beim Upload eine sofortige, verständliche Fehlermeldung sehen, wenn die Datei kein unterstütztes Videoformat ist, damit ich nicht erst im Player einen kaputten Player vorfinde.
3. Als Lehrkraft möchte ich beim Upload eine verständliche Fehlermeldung sehen, wenn die Datei die Größenobergrenze (500 MB) überschreitet, damit ich weiß, warum der Upload nicht funktioniert.
4. Als Lehrkraft möchte ich nach erfolgreichem Upload automatisch zum Player weitergeleitet werden, damit ich die Boardstory direkt prüfen kann.
5. Als Lehrkraft möchte ich einen sichtbaren Ladezustand während des Uploads sehen, damit ich weiß, dass die App reagiert (insbesondere bei größeren Dateien / schwacher Hardware).
6. Als Kind möchte ich auf `/player` eine Boardstory per Klick auf Play starten können, damit ich sie ansehen kann.
7. Als Kind möchte ich die Wiedergabe per Klick pausieren und fortsetzen können, damit ich in meinem eigenen Tempo schauen kann.
8. Als Kind möchte ich auf einer Zeitleiste sehen, wie weit ich in der Boardstory bin und wie lange sie insgesamt dauert, damit ich mich orientieren kann.
9. Als Kind möchte ich per Klick auf die Zeitleiste an eine beliebige Stelle springen können, damit ich frei navigieren kann.
10. Als Kind möchte ich per Knopfdruck zum nächsten Kapitel vorspringen können, damit ich zur nächsten Szene wechseln kann, ohne genau zielen zu müssen.
11. Als Kind möchte ich per Knopfdruck zum vorherigen Kapitel zurückspringen können, damit ich eine Szene nochmal ansehen kann.
12. Als Kind möchte ich, dass „vorheriges Kapitel“ immer an derselben, vorhersehbaren Stelle landet, damit Kapitelgrenzen konsistent und nicht abhängig von meiner aktuellen Position sind.
13. Als Kind möchte ich die Lautstärke regeln können, damit die Wiedergabe für mich angenehm laut ist.
14. Als Kind möchte ich den Ton stummschalten und wieder aktivieren können, damit ich flexibel bin (z. B. im Klassenraum).
15. Als Kind möchte ich große, gut klickbare Steuerelemente sehen, damit ich sie auch mit kleinen Händen bzw. auf einem Touch-Gerät sicher bedienen kann.
16. Als Kind möchte ich vor der Aufnahme meinen Namen eingeben, damit meine Aufnahme später meiner Lehrkraft zugeordnet werden kann.
17. Als Kind möchte ich während der Wiedergabe eine Aufnahme starten können (z. B. über Mikrofon), damit ich zur Boardstory vorlesen kann.
18. Als Kind möchte ich die Aufnahme wieder stoppen können, damit ich die Vorlese-Session beende, wann ich möchte.
19. Als Kind möchte ich einen klaren visuellen Hinweis sehen, dass gerade aufgenommen wird, damit ich nicht versehentlich ohne zu wissen aufnehme.
20. Als Kind möchte ich vom Browser um Mikrofon-Erlaubnis gefragt werden, bevor eine Aufnahme startet, damit meine Privatsphäre gewahrt bleibt.
21. Als Kind möchte ich eine verständliche Rückmeldung sehen, wenn die Mikrofon-Erlaubnis verweigert wurde, damit ich weiß, warum die Aufnahme nicht startet.
22. Als Kind möchte ich, dass meine fertige Aufnahme automatisch gespeichert wird, damit ich nichts manuell exportieren oder hochladen muss.
23. Als Lehrkraft möchte ich einen direkten Link/eine Route zu `/player/:videoId` aufrufen können, damit ich eine bestimmte Boardstory gezielt öffnen kann.
24. Als Lehrkraft möchte ich, dass ein Reload auf `/player/:videoId` das Video ohne erneuten Upload weiter verfügbar hält, damit ein versehentlicher Reload nicht die ganze Vorführung zunichtemacht.
25. Als Lehrkraft möchte ich auf `/recordings` eine Übersicht aller vorhandenen Schüleraufnahmen sehen, damit ich weiß, wer bereits vorgelesen hat.
26. Als Lehrkraft möchte ich zu jeder Aufnahme den eingegebenen Namen des Kindes sehen, damit ich weiß, wem die Aufnahme gehört.
27. Als Lehrkraft möchte ich eine Aufnahme direkt im Dashboard abspielen können, damit ich sie ohne Umweg anhören kann.
28. Als Lehrkraft möchte ich einer Aufnahme einen Status zuweisen können (`unbewertet` / `normal` / `bestanden`), damit ich meinen Bewertungsfortschritt festhalten kann.
29. Als Lehrkraft möchte ich einer Aufnahme ein Sterne-Rating (1–5) geben können, damit ich eine feinere Einschätzung als nur den Status dokumentieren kann.
30. Als Lehrkraft möchte ich einer Aufnahme einen optionalen Freitext-Kommentar hinzufügen können, damit ich individuelles Feedback festhalten kann.
31. Als Lehrkraft möchte ich Aufnahmen nach Status/Bewertung filtern oder sortieren können, damit ich z. B. schnell alle `unbewertet`en Aufnahmen finde.
32. Als Lehrkraft möchte ich, dass neue Status-/Bewertungsänderungen dauerhaft gespeichert werden (Reload-fest), damit meine Bewertungsarbeit nicht verloren geht.
33. Als Lehrkraft möchte ich, dass das Kind seine Bewertung/den Status nicht einsehen kann, damit das Bewertungstool ein rein internes Lehrkraft-Werkzeug bleibt (kein UI-Pfad dafür im Player).
34. Als Entwickler:in möchte ich, dass Video-Upload, Cue-Point-Generierung und Recording-Speicherung über ein einziges Persistenz-Modul laufen, damit Tests an einer klaren Modul-Grenze ansetzen können statt volle Komponenten mit gemocktem `<video>`/`MediaRecorder` zu testen.
35. Als Entwickler:in möchte ich, dass Cue-Point-Generierung und Vor/Zurück-Navigation als reine, DOM-freie Funktionen implementiert sind, damit sie ohne Browser-Umgebung getestet werden können.
36. Als Bewerber:in (Entwickler:in) möchte ich im README alle Tech-Stack-Entscheidungen begründen, damit Onilo nachvollziehen kann, wie ich denke.
37. Als Bewerber:in möchte ich im README eine Aufwandsschätzung dokumentieren, damit meine Zeitplanung transparent ist.
38. Als Bewerber:in möchte ich vor der Implementierung ein Architektur-/Ablaufdiagramm erstellen, damit der Gesamtfluss (Upload → Player → Recording → Dashboard) nachvollziehbar ist.
39. Als Bewerber:in möchte ich, dass Nutzereingaben (Upload-Datei, Mikrofon-Aufnahme) sicher behandelt werden, damit die App keine offensichtlichen Sicherheitslücken hat (Typ-/Größenprüfung beim Upload, keine Ausführung von Nutzerinhalten als Code).
40. Als Bewerber:in möchte ich, dass der Player auch auf schwächerer Schul-Hardware flüssig lädt und läuft, damit die App performant genug für den Zieleinsatz ist.

## Implementation Decisions

- **Routing:** Drei Routen via `react-router` in einer SPA: `/editor`, `/player/:videoId`, `/recordings` (siehe ADR-0002, `CONTEXT.md`).
- **Persistenz-Modul (primärer Seam):** Ein zentrales Modul (z. B. `videoRepository`/`db`) kapselt sämtlichen IndexedDB-Zugriff und ist die einzige Schnittstelle, über die Routen/Komponenten mit gespeicherten Daten interagieren. Exponierte Operationen (Namen sind Vorschlag, keine Verbindlichkeit):
  - Video speichern (Blob + Metadaten: Name, MIME-Type, Uploaddatum, generierte `videoId`, generierte Cue-Points gemäß ADR-0004) und per `videoId` laden.
  - Recording speichern (Audio-Blob + `videoId`-Zuordnung + `studentName` gemäß ADR-0005, Default-Status `unbewertet`, Rating `null`, Kommentar `""`/`null`) und Recordings listen (optional gefiltert nach `videoId`).
  - Recording-Status, Rating und Kommentar aktualisieren (Bewertung durch Lehrkraft im Dashboard).
  - Upload-Validierung (MIME-Type-Whitelist, 500-MB-Obergrenze, Best-Effort gemäß ADR-0003) liegt vor dem Schreiben in dieses Modul.
- **Domänenfunktionen (zweiter Seam, DOM-frei):** `generateCuePoints(duration, intervalSec)` (Referenzimplementierung in ADR-0004) sowie `findNextCuePoint`/`findPreviousCuePoint(cues, currentTime)` für die Vor/Zurück-Navigation. Diese Funktionen kennen weder IndexedDB noch das DOM/`<video>`-Element.
- **Video-Handoff:** `/editor` schreibt den Video-Blob + generierte Cue-Points direkt beim Upload in IndexedDB und navigiert zu `/player/:videoId` (URL-Param, kein globaler State-Store, siehe ADR-0003). `/player` lädt den Blob per `videoId` nach und erzeugt sich selbst per `URL.createObjectURL()` frisch (revoked beim Unmount).
- **Player-Controls-State:** `currentTime`, `volume`, `isRecording` bleiben lokaler Component-State in `/player`, nicht global/Context (ADR-0003). Ein Reload auf `/player` verliert die Abspielposition, aber nicht den Blob — akzeptierter Trade-off.
- **Player-Framework:** Vidstack als Basis für die Video-Wiedergabe-Primitiven (Play/Pause, Zeitleiste, Lautstärke) — Begründung und Alternativen sind Teil der README-Tech-Stack-Begründung, nicht dieser Spec (Aufgabenstellung verlangt „begründe im README“, nicht in der Spec).
- **Cue-Point-Navigation:** Vor/Zurück im Player nutzt `findNextCuePoint`/`findPreviousCuePoint` gegen das gespeicherte Cue-Point-Array, nicht ein festes Zeit-Offset (ADR-0004).
- **Aufnahmefunktion:** Nutzung der `MediaRecorder`-Web-API für Mikrofon-Aufnahme während der Wiedergabe. Vor Aufnahmestart wird `studentName` per Freitextfeld erfasst (ADR-0005). Nach Stopp der Aufnahme wird das Ergebnis automatisch über das Persistenz-Modul gespeichert (kein manueller Export-Schritt).
- **Recordings-Dashboard:** `/recordings` liest ausschließlich über das Persistenz-Modul, zeigt pro Recording `studentName`, Status, Rating, Kommentar und einen Inline-Player zum Anhören. Filter-/Sortierlogik (z. B. nach Status) ist reine Anzeigelogik auf Basis der vom Persistenz-Modul gelieferten Liste.
- **Status/Bewertung-Trennung:** `Status` (`unbewertet`/`normal`/`bestanden`) und `Bewertung` (Sterne-Rating 1–5 + optionaler Kommentar) sind laut Glossar getrennte Konzepte und werden entsprechend als getrennte Felder geführt, nicht vermischt.
- **Upload-Sicherheit:** MIME-Type- und Größen-Check vor dem IndexedDB-Write (ADR-0003) — dokumentiert als UX-/Ressourcen-Guard, nicht als hartes Security-Boundary (kein Server zur unabhängigen Verifikation vorhanden).
- **Styling:** Umsetzung des Onilo-Farbschemas (`#58A8C3`/`#4DBFDB` als Basis, `#EF7B3C` als Auszeichnungs-/Record-Farbe, `#EAFBFE` als ruhiger Hintergrund) mit großen, abgerundeten, gut klickbaren Steuerelementen für die Zielgruppe 6–10 Jahre. Konkreter Styling-Ansatz (z. B. Tailwind) wird im README begründet, nicht hier festgelegt.

## Testing Decisions

- Gute Tests hier prüfen **Verhalten über die Modul-Grenze**, nicht Implementierungsdetails (kein Testen von internen IndexedDB-Transaktionsdetails, kein Snapshotten von JSX-Struktur).
- **Persistenz-Modul:** vollständig getestet mit `fake-indexeddb` (kein echter Browser nötig) — Speichern/Laden von Video-Records inkl. Cue-Points, Speichern/Listen/Aktualisieren von Recordings (Status, Rating, Kommentar), Upload-Validierung (MIME-Type-Whitelist, 500-MB-Grenze: Grenzfälle knapp unter/über dem Limit).
- **Domänenfunktionen:** `generateCuePoints` (Grenzfälle: Dauer 0, Dauer kleiner als Intervall, exakte Intervall-Vielfache) sowie `findNextCuePoint`/`findPreviousCuePoint` (Grenzfälle: `currentTime` vor erstem/nach letztem Cue-Point) als reine Unit-Tests ohne DOM.
- Diese zwei Modul-Seams sind gemäß Nutzerentscheidung die primären Test-Grenzen für diese Spec; volle Component-Mount-Tests mit gemocktem `<video>`/`MediaRecorder` sind explizit **nicht** Teil dieser Spec (siehe Out of Scope).
- **Testablauf:** Test-Last statt Test-First (ADR-0006) — pro fertiger Slice erst implementieren, danach testen. Kein Red-Green-Zyklus vorab, da die Schnittstellenform bei explorativem UI-/State-Code vorab oft nicht feststeht.
- Kein bestehendes Test-Setup im Repo vorhanden (Greenfield) — Test-Runner/Library-Wahl (z. B. Vitest, da es Vite-nativ ist) wird im README begründet.

## Out of Scope

- Server-seitige Persistenz, Auth, Mehrbenutzer-/Cross-Device-Zusammenführung von Recordings (folgt aus ADR-0001, ADR-0005).
- Manuelles Setzen/Bearbeiten/Löschen von Cue-Points im Editor (ADR-0004) — Editor bleibt auf Upload beschränkt.
- Feste Klassenlisten-/Schülerverwaltung (ADR-0005) — `studentName` bleibt ungeprüfter Freitext.
- Verschlüsselung-at-rest, Magic-Bytes-Validierung des Video-Uploads (als robustere Alternative zu `file.type` in ADR-0003 erwähnt, aber als optionale Erweiterung markiert).
- Volle React-Component-/Integration-Tests mit gemocktem `<video>`/`MediaRecorder`-DOM (siehe Testing Decisions) — nicht Teil dieser Spec, ggf. spätere Erweiterung.
- Internationalisierung/Mehrsprachigkeit der UI.
- Offline-Fähigkeit über die reine In-Browser-Persistenz hinaus (kein Service Worker/PWA-Anspruch).

## Further Notes

- Alle sechs bestehenden ADRs (`docs/adr/0001`–`0006`) sind bereits verbindliche Architekturentscheidungen für diese Spec und wurden hier konsequent referenziert statt wiederholt neu entschieden.
- Domain-Vokabular durchgängig gemäß `CONTEXT.md`: **Boardstory** (nicht „Video“ als Fachbegriff), **Cue-Point** (nicht „Marker“/„Seek-Point“), **Recording** (nicht „Aufnahme“ als Fachbegriff/„Take“), **Bewertung** vs. **Status** (getrennte Konzepte, siehe Glossar), **Editor**/**Player**/**Recordings-Dashboard** als Routennamen.
- Die Aufgabenstellung selbst gewichtet **Vollständigkeit über Qualität** im 3-Tage-Rahmen — bei Zeitdruck sollten die Pflichtfunktionen (Tabelle in der Aufgabenstellung) Vorrang vor Optionalem (Out of Scope-Punkten, die als „mögliche Erweiterung“ markiert sind) behalten.
- Architektur-/Ablaufdiagramm (Bewertungskriterium „Architektur & Diagramm“) ist README-Pflicht, aber nicht Teil dieser Spec selbst.
