# Test-Last statt Test-First (TDD)

Bei der Umsetzung wird pro fertiger Slice erst implementiert und danach getestet, statt test-first im Red-Green-Zyklus. Bei UI-/State-lastigem Code (Player-Navigation über Cue-Points, Recording-Flow) steht die Form der Schnittstelle vorab oft nicht fest genug, um sie sinnvoll vorher in einem Test zu fixieren — Test-First würde hier eher raten als entwerfen.

**Considered:** Striktes TDD (Red-Green-Refactor). Verworfen, weil die Design-Unsicherheit bei explorativem UI-Code den Test-first-Zyklus zur Bremse macht, ohne dass er in dieser frühen Phase echten Entwurfsnutzen liefert.

**Consequence:** Tests fungieren nicht mehr als Design-Werkzeug, das die Schnittstelle vor der Implementierung erzwingt — die Architektur muss anderweitig abgesichert werden (Code-Review, `CONTEXT.md`/Domain-Modeling). Getestet wird weiterhin lückenlos pro Slice, nur nachgelagert statt vorgelagert.
