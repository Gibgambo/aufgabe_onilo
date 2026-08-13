const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;

export function validateUpload(file: File): string | null {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return "Dieses Videoformat wird nicht unterstützt. Bitte lade eine MP4- oder WebM-Datei hoch.";
    }
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
        return "Die Datei ist zu groß. Maximal erlaubt sind 500 MB.";
    }
    return null;
}