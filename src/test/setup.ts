import "fake-indexeddb/auto";
import "@testing-library/jest-dom/vitest";

if (typeof indexedDB === "undefined") {
    throw new Error("fake-indexeddb hat indexedDB nicht global verfügbar gemacht");
}