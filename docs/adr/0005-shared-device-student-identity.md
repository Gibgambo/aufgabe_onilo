# Schüler-Identität via Freitext-Name, ein gemeinsames Gerät pro Klassenzimmer

`/recordings` soll Aufnahmen einzelnen Kindern zuordnen (z. B. „Tim — bestanden"). Ohne Backend (ADR-0001) gibt es keine Möglichkeit, Aufnahmen von mehreren Geräten zentral zusammenzuführen — alles liegt lokal in IndexedDB in genau einem Browser. Wir gehen deshalb von **einem gemeinsam genutzten Gerät pro Klassenzimmer** aus (Lehrer-PC oder Tablet an einer Vorlesestation), an dem Kinder nacheinander aufnehmen.

Jedes Recording bekommt ein `studentName`-Feld (freier Text), das das Kind selbst vor der Aufnahme eingibt (einfaches Textfeld im Player, z. B. „Wie heißt du?"). `/recordings` listet Aufnahmen mit diesem Namen und erlaubt Filtern/Sortieren.

**Warum kein Multi-Geräte-Szenario:** Jedes Kind an einem eigenen Gerät hätte eine zentrale Lehrkraft-Übersicht über Geräte hinweg erfordert — das braucht einen Server zur Synchronisation und widerspricht direkt ADR-0001. Es hätte außerdem Auth für den Lehrkraft-Zugriff und ein Datenschutzthema bei serverseitig gespeicherten Kindernamen nach sich gezogen — ein deutlich größerer Kurswechsel als im 3-Tage-Rahmen sinnvoll.

**Warum Freitext statt fester Klassenliste:** Eine vorab gepflegte Schülerliste (z. B. „Klasse 6B" mit festen Namen) wäre robuster gegen Tippfehler, würde aber eine eigene Verwaltungs-UI (Klasse anlegen, Schüler hinzufügen/entfernen) erfordern — Funktionsumfang, den die Aufgabenstellung nicht verlangt. Freitext ist die einfachste Lösung, die das Grundbedürfnis (Aufnahme einem Namen zuordnen) erfüllt.

**Considered:**
- **Multi-Geräte mit Backend-Sync** — verworfen: widerspricht ADR-0001, deutlich größerer Scope (Server, Auth, Datenschutz für Kindernamen).
- **Feste Klassenliste/Schülerverwaltung** — verworfen: Mehraufwand ohne Anforderung aus der Aufgabenstellung; bliebe mögliche Erweiterung.

**Consequence:** Das Szenario ist auf ein gemeinsames Gerät pro Klassenzimmer beschränkt — mehrere Geräte (z. B. Tablets, auf denen Kinder parallel aufnehmen) würden getrennte, nicht zusammengeführte Aufnahme-Listen ergeben. `studentName` ist ungeprüfter Freitext (Tippfehler, Duplikate, Verwechslungen möglich) — bewusst akzeptierte Einfachheit, kein Verzeichnis-Abgleich.
