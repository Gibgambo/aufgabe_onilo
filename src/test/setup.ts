import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

if (typeof indexedDB === "undefined") {
  throw new Error(
    "fake-indexeddb hat indexedDB nicht global verfügbar gemacht",
  );
}

// jsdom implementiert <dialog> nicht (showModal/close fehlen).
if (
  typeof HTMLDialogElement !== "undefined" &&
  !HTMLDialogElement.prototype.showModal
) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
}
if (
  typeof HTMLDialogElement !== "undefined" &&
  !HTMLDialogElement.prototype.close
) {
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) {
      return;
    }
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

afterEach(() => {
  cleanup();
});
