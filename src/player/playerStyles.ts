const focusRingClass =
  "focus-visible:outline focus-visible:outline-4 focus-visible:outline-onilo-honey";

export const primaryControlButtonClass =
  "flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-white text-onilo-stage " +
  "shadow-[0_6px_0_0_rgba(18,54,71,0.35)] transition-transform hover:scale-105 active:translate-y-1 active:shadow-none " +
  focusRingClass;

export const secondaryControlButtonClass =
  "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border-2 border-white/25 bg-white/10 text-white " +
  "backdrop-blur transition-colors hover:bg-white/20 active:bg-white/25 " +
  focusRingClass +
  " disabled:opacity-40";

export const ghostControlButtonClass =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white/80 transition-colors " +
  "hover:bg-white/10 hover:text-white " +
  focusRingClass;

export const recordButtonClass =
  "flex items-center gap-3 rounded-full bg-onilo-accent px-7 py-4 font-display text-lg font-semibold text-white " +
  "shadow-[0_5px_0_0_#d95f1f] transition-transform hover:scale-[1.03] active:translate-y-1 active:shadow-none " +
  focusRingClass +
  " disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100";

export const stopButtonClass =
  "flex items-center gap-3 rounded-full bg-onilo-stage px-7 py-4 font-display text-lg font-semibold text-white " +
  "shadow-[0_5px_0_0_rgba(18,54,71,0.55)] transition-transform hover:scale-[1.03] hover:bg-onilo-stage-light " +
  "active:translate-y-1 active:shadow-none " +
  focusRingClass;
