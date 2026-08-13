import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

if (typeof indexedDB === "undefined") {
  throw new Error(
    "fake-indexeddb hat indexedDB nicht global verfügbar gemacht",
  );
}

afterEach(() => {
  cleanup();
});
