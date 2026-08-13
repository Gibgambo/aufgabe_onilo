export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        reject(new Error("Videodauer konnte nicht ermittelt werden"));
        return;
      }
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Videodauer konnte nicht ermittelt werden"));
    };

    video.src = objectUrl;
  });
}
