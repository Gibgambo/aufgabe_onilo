import { afterEach, describe, expect, it } from "vitest";
import { getVideoDuration } from "./videoDuration";

function stubVideoMetadataLoad(duration: number) {
  Object.defineProperty(HTMLMediaElement.prototype, "duration", {
    configurable: true,
    get() {
      return duration;
    },
  });
  Object.defineProperty(HTMLMediaElement.prototype, "src", {
    configurable: true,
    set() {
      queueMicrotask(() => this.dispatchEvent(new Event("loadedmetadata")));
    },
  });
}

function stubVideoLoadError() {
  Object.defineProperty(HTMLMediaElement.prototype, "src", {
    configurable: true,
    set() {
      queueMicrotask(() => this.dispatchEvent(new Event("error")));
    },
  });
}

afterEach(() => {
  Reflect.deleteProperty(HTMLMediaElement.prototype, "duration");
  Reflect.deleteProperty(HTMLMediaElement.prototype, "src");
});

describe("getVideoDuration", () => {
  it("löst mit der Videodauer auf, sobald die Metadaten geladen sind", async () => {
    stubVideoMetadataLoad(123.45);
    const file = new File(["fake"], "boardstory.mp4", { type: "video/mp4" });

    await expect(getVideoDuration(file)).resolves.toBe(123.45);
  });

  it("lehnt ab, wenn das Video nicht geladen werden kann", async () => {
    stubVideoLoadError();
    const file = new File(["fake"], "broken.mp4", { type: "video/mp4" });

    await expect(getVideoDuration(file)).rejects.toThrow();
  });

  it("lehnt ab, wenn die ermittelte Dauer 0 ist", async () => {
    stubVideoMetadataLoad(0);
    const file = new File(["fake"], "leer.mp4", { type: "video/mp4" });

    await expect(getVideoDuration(file)).rejects.toThrow();
  });

  it("lehnt ab, wenn die ermittelte Dauer NaN ist", async () => {
    stubVideoMetadataLoad(NaN);
    const file = new File(["fake"], "kaputt.mp4", { type: "video/mp4" });

    await expect(getVideoDuration(file)).rejects.toThrow();
  });
});
