import { openDB, type DBSchema } from "idb";

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

export interface VideoRecord {
  videoId: string;
  name: string;
  mimeType: string;
  uploadedAt: string;
  blob: Blob;
  cuePoints: number[];
}

export interface RecordingRecord {
  recordingId: string;
  videoId: string;
  studentName: string;
  blob: Blob;
  status: "unbewertet" | "normal" | "bestanden";
  rating: number | null;
  comment: string | null;
}

interface BoardstoryDB extends DBSchema {
  videos: {
    key: string;
    value: VideoRecord;
  };
  recordings: {
    key: string;
    value: RecordingRecord;
    indexes: { videoId: string };
  };
}

const DB_NAME = "boardstory-player";
const DB_VERSION = 1;

function getDb() {
  return openDB<BoardstoryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("videos", { keyPath: "videoId" });
      const recordingsStore = db.createObjectStore("recordings", {
        keyPath: "recordingId",
      });
      recordingsStore.createIndex("videoId", "videoId");
    },
  });
}

export interface VideoInput {
  name: string;
  mimeType: string;
  blob: Blob;
  cuePoints: number[];
}

export async function saveVideo(input: VideoInput): Promise<string> {
  const videoId = crypto.randomUUID();
  const db = await getDb();
  await db.put("videos", {
    videoId,
    name: input.name,
    mimeType: input.mimeType,
    blob: input.blob,
    cuePoints: input.cuePoints,
    uploadedAt: new Date().toISOString(),
  });
  return videoId;
}

export async function loadVideo(
  videoId: string,
): Promise<VideoRecord | undefined> {
  const db = await getDb();
  return db.get("videos", videoId);
}

export interface RecordingInput {
  videoId: string;
  studentName: string;
  blob: Blob;
}

export async function saveRecording(input: RecordingInput): Promise<string> {
  const recordingId = crypto.randomUUID();
  const db = await getDb();
  await db.put("recordings", {
    recordingId,
    videoId: input.videoId,
    studentName: input.studentName,
    blob: input.blob,
    status: "unbewertet",
    rating: null,
    comment: null,
  });
  return recordingId;
}

export async function listRecordings(
  videoId?: string,
): Promise<RecordingRecord[]> {
  const db = await getDb();
  if (videoId) {
    return db.getAllFromIndex("recordings", "videoId", videoId);
  }
  return db.getAll("recordings");
}

export type RecordingUpdate = Partial<
  Pick<RecordingRecord, "status" | "rating" | "comment">
>;

export async function updateRecording(
  recordingId: string,
  updates: RecordingUpdate,
): Promise<void> {
  const db = await getDb();
  const existing = await db.get("recordings", recordingId);
  if (!existing) {
    throw new Error(`Recording ${recordingId} existiert nicht`);
  }
  await db.put("recordings", { ...existing, ...updates });
}
