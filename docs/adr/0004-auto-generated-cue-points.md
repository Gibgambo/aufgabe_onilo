# Auto-generierte Cue-Points in festen Intervallen

Der Player muss kapitelweise Vor/Zurück-Navigation via Cue-/Seek-Points unterstützen (Aufgabenstellung). Wir generieren die Cue-Points **automatisch aus der Videodauer**, sobald die Metadaten geladen sind, statt sie manuell im Editor setzen zu lassen:

```js
function generateCuePoints(duration, intervalSec = 25) {
  const cues = [];
  for (let t = 0; t < duration; t += intervalSec) cues.push(t);
  return cues; // z. B. [0, 25, 50, 75, ...]
}
```

Das Array wird zusammen mit dem Video-Record in IndexedDB gespeichert (Ergänzung zum Schema aus ADR-0003). "Vor/Zurück" im Player springt zum nächsten/vorherigen Wert in diesem Array relativ zu `currentTime` — nicht um ein festes Zeit-Offset.

**Warum automatisch statt manuell im Editor gesetzt:** Manuelles Setzen würde eine eigene Marker-UI im Mini-Editor erfordern (Zeitleiste mit Klick-zum-Markieren, Marker-Liste, Speichern/Bearbeiten/Löschen) — deutlicher Mehraufwand im 3-Tage-Rahmen für eine Funktion, die die Aufgabenstellung nicht explizit fordert (nur „kapitelweise Navigation", keine Aussage zur Marker-Erzeugung). Auto-Generierung erfüllt das „kapitelweise"-Framing direkt und braucht nur die Funktion oben.

**Warum feste Intervalle statt Zeit-Offset-Skip (±10s):** Ein reiner Offset-Skip (`currentTime += 10`) wäre einfacher, trifft aber das Konzept „Kapitel" schlechter — es gibt keine festen, wiederholbaren Sprungpunkte, jeder Sprung landet an einer anderen Stelle je nach Ausgangsposition. Mit einem festen Cue-Point-Array sind Kapitelgrenzen konsistent und vorhersehbar (z. B. für Kinder: „Kapitel 3" landet immer an derselben Stelle).

**Considered:**
- **Manuell im Editor gesetzte Marker** — verworfen: erfordert eigene Marker-UI (Zeitleiste, Setzen/Bearbeiten/Löschen), Mehraufwand ohne Anforderung aus der Aufgabenstellung. Bliebe eine mögliche spätere Erweiterung, falls Zeit übrig bleibt.
- **Festes Zeit-Offset-Skip (±10s)** — verworfen: trifft „kapitelweise" schlechter, keine konsistenten Kapitelgrenzen.

**Consequence:** Kapitelanzahl hängt allein von Videolänge und Intervall ab, nicht von inhaltlicher Struktur der Boardstory — ein 3-minütiges Video bekommt automatisch ~7 gleich lange „Kapitel" ohne Bezug zu Szenenwechseln. Bewusst akzeptierte Vereinfachung für den 3-Tage-Rahmen. Cue-Point-Array ist Teil des IndexedDB-Video-Records (Erweiterung des Schemas aus ADR-0003).
