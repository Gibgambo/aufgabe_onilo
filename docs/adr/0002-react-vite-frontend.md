# React + Vite als Frontend-Framework

Der Player läuft rein clientseitig (ADR-0001), richtet sich an Schulen mit teils schwacher Hardware und instabiler Internetverbindung, und muss in 3 Tagen umgesetzt werden. Wir haben uns für **React + Vite** entschieden (CSR-SPA (Client Side Rendering/Single Page Application), `react-router` für die drei Routen, kein SSR (Server Side Rendering)), primär wegen Entwickler-Vertrautheit und dem größeren Ökosystem — das senkt das Risiko, in 3 Tagen nicht fertig zu werden.

**Ehrliche Einordnung:** Technisch wäre **Svelte + Vite** die pragmatischere Wahl für die Zielumgebung gewesen. Svelte kompiliert zu Vanilla-JS ohne VDOM-Runtime im Client; in Benchmarks mit vergleichbarer Funktionalität lag eine Svelte-5-App bei ~47 KB gegenüber ~156 KB für die React-19-Variante — grob Faktor 3 weniger JS, was auf schwacher Schul-Hardware (Parse-/Execution-Zeit) und langsamen Verbindungen (Ladezeit) spürbar wäre. Vidstack unterstützt Svelte über seine Web-Component-Basis genauso gut wie React (kein Nachteil dort). Diese Wahl wurde bewusst gegen die technisch überlegene Option getroffen, weil Vertrautheit mit React + das breitere Ökosystem (Bibliotheken, Doku, Tooling, AI-Unterstützung) das Risiko im 3-Tage-Rahmen stärker senkt als der Bundle-Vorteil von Svelte den Nutzer:innen bringt.

Vidstack ist dokumentiert-gut angebunden an React, Vue, Svelte, Next.js und Nuxt sowie an Tailwind CSS für das Styling der Player-UI. Wir haben alle diese Optionen berücksichtigt; Tailwind ist unabhängig von der Framework-Wahl vorgesehen (Styling-Ansatz wird in einer eigenen ADR entschieden).

**Considered:**
- **Svelte + Vite** — technisch beste Wahl für die Zielhardware (s. o.). Verworfen wegen fehlender Vertrautheit und dem damit verbundenen Zeitrisiko in 3 Tagen.
- **SolidJS** — ähnlich kleine Bundle-Größe wie Svelte (fine-grained reactivity, kein VDOM), aber JSX-Syntax nahe an React. Wäre ein Mittelweg gewesen; nicht gewählt, da das Ökosystem kleiner ist als Reacts und der Vertrautheitsvorteil gegenüber React entfällt.
- **Vue + Vite** — solide Alternative, ähnlich großes Ökosystem wie React, aber kein Vertrautheitsvorsprung gegenüber React für uns.
- **Next.js** — verworfen: SSR/ISR/RSC setzen einen laufenden Server voraus, widerspricht ADR-0001. Ein statischer Export würde die Framework-Komplexität ohne jeden Nutzen mitschleppen.
- **Nuxt** — aus demselben Grund wie Next.js verworfen: das Vue-Pendant setzt ebenfalls standardmäßig einen laufenden Server für SSR voraus, widerspricht ADR-0001.

**Consequence:** Auf sehr schwacher Hardware/langsamen Netzen ist die initiale Ladezeit/Parse-Zeit höher als mit Svelte. Wir mindern das durch schlankes Dependency-Budget und Route-based Code-Splitting. Der größere strukturelle Fix (keine dauerhafte Server-Abhängigkeit während der Nutzung) ist ohnehin schon durch ADR-0001 abgedeckt.
