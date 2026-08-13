import { useParams } from "react-router";
import { useState } from "react";
import {
  MediaPlayer,
  MediaProvider,
  MuteButton,
  PlayButton,
  Time,
  TimeSlider,
  VolumeSlider,
  useMediaRemote,
  useMediaState,
} from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { useBoardstoryVideo } from "../player/useBoardstoryVideo";
import { findNextCuePoint, findPreviousCuePoint } from "../domain/cuePoints";
import type { VideoMimeType } from "@vidstack/react";
import { useRecording } from "../player/useRecording";

const controlButtonClass =
  "flex h-16 w-16 items-center justify-center rounded-full bg-onilo-primary text-3xl text-white hover:bg-onilo-secondary";

function StatusMessage({ text }: { text: string }) {
  return (
    <p
      role="status"
      className="text-onilo-primary text-2xl font-semibold text-center"
    >
      {text}
    </p>
  );
}

function PlayPauseButton() {
  const isPaused = useMediaState("paused");
  return (
    <PlayButton
      className={controlButtonClass}
      aria-label={isPaused ? "Abspielen" : "Pause"}
    >
      {isPaused ? "▶" : "⏸"}
    </PlayButton>
  );
}

function MuteToggleButton() {
  const isMuted = useMediaState("muted");
  return (
    <MuteButton
      className={controlButtonClass}
      aria-label={isMuted ? "Ton aktivieren" : "Ton stummschalten"}
    >
      {isMuted ? "🔇" : "🔊"}
    </MuteButton>
  );
}

function ChapterButton({
  cuePoints,
  direction,
}: {
  cuePoints: number[];
  direction: "previous" | "next";
}) {
  const currentTime = useMediaState("currentTime");
  const remote = useMediaRemote();
  const label =
    direction === "previous" ? "Vorheriges Kapitel" : "Nächstes Kapitel";

  function handleClick() {
    const target =
      direction === "previous"
        ? findPreviousCuePoint(cuePoints, currentTime)
        : findNextCuePoint(cuePoints, currentTime);
    remote.seek(target);
  }

  return (
    <button
      type="button"
      className={controlButtonClass}
      aria-label={label}
      onClick={handleClick}
    >
      {direction === "previous" ? "⏮" : "⏭"}
    </button>
  );
}

function Timeline() {
  return (
    <div className="flex w-full items-center gap-3">
      <TimeSlider.Root className="group relative flex h-10 w-full touch-none select-none items-center outline-none">
        <TimeSlider.Track className="relative h-3 w-full rounded-full bg-onilo-primary/30">
          <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-onilo-primary" />
        </TimeSlider.Track>
        <TimeSlider.Thumb
          className="absolute top-1/2 left-(--slider-fill) h-7 w-7 -translate-x-1/2
    -translate-y-1/2 rounded-full bg-onilo-accent shadow"
        />
      </TimeSlider.Root>
      <div className="flex shrink-0 items-center gap-1 text-lg font-medium text-onilo-primary">
        <Time type="current" />
        <span>/</span>
        <Time type="duration" />
      </div>
    </div>
  );
}

function VolumeControl() {
  return (
    <div className="flex items-center gap-2">
      <MuteToggleButton />
      <VolumeSlider.Root className="group relative flex h-10 w-32 touch-none select-none items-center outline-none">
        <VolumeSlider.Track className="relative h-3 w-full rounded-full bg-onilo-primary/30">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-onilo-primary" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb
          className="absolute top-1/2 left-(--slider-fill) h-7 w-7 -translate-x-1/2
    -translate-y-1/2 rounded-full bg-onilo-accent shadow"
        />
      </VolumeSlider.Root>
    </div>
  );
}

export function RecordingPanel({ videoId }: { videoId: string }) {
  const [studentName, setStudentName] = useState("");
  const { state, start, stop } = useRecording(videoId);
  const isRecording = state.status === "recording";
  const canStart = studentName.trim().length > 0 && state.status === "idle";

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3 rounded-xl bg-white p-6 shadow">
      <label className="flex w-full max-w-sm flex-col gap-1 font-medium text-onilo-primary">
        Wie lautet dein Name? 
        <input
          type="text"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          disabled={state.status !== "idle"}
          className="rounded-lg border border-onilo-primary/30 bg-white px-3 py-2 text-black"
        />
      </label>

      <button
        type="button"
        onClick={() => (isRecording ? stop() : start(studentName))}
        disabled={!isRecording && !canStart}
        className={controlButtonClass}
        aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
      >
        {isRecording ? "⏹" : "🎙"}
      </button>

      {isRecording && (
        <p role="status" className="text-onilo-accent text-lg font-semibold">
          ● Aufnahme läuft…
        </p>
      )}

      {state.status === "permission-denied" && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          Mikrofon-Zugriff wurde verweigert. Bitte erlaube den Zugriff in deinem
          Browser, um eine Aufnahme zu starten.
        </p>
      )}

      {state.status === "error" && (
        <p role="alert" className="text-onilo-accent text-lg font-medium">
          Die Aufnahme konnte nicht gespeichert werden. Bitte versuche es
          erneut.
        </p>
      )}
    </div>
  );
}

export function Player() {
  const { videoId } = useParams<{ videoId: string }>();
  const state = useBoardstoryVideo(videoId ?? "");

  return (
    <div className="min-h-screen bg-onilo-background flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-onilo-primary text-3xl font-bold">Player</h1>

      {state.status === "loading" && (
        <StatusMessage text="Boardstory wird geladen…" />
      )}

      {state.status === "not-found" && (
        <StatusMessage text="Diese Boardstory wurde nicht gefunden." />
      )}

      {state.status === "error" && (
        <StatusMessage text="Die Boardstory konnte nicht geladen werden. Bitte versuche es erneut." />
      )}

      {state.status === "ready" && (
        <>
          <MediaPlayer
            src={{ src: state.videoUrl, type: state.mimeType as VideoMimeType }}
            playsInline
            className="flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-xl bg-black p-4"
          >
            <MediaProvider />
            <Timeline />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ChapterButton cuePoints={state.cuePoints} direction="previous" />
              <PlayPauseButton />
              <ChapterButton cuePoints={state.cuePoints} direction="next" />
              <VolumeControl />
            </div>
          </MediaPlayer>
          <RecordingPanel videoId={videoId ?? ""} />
        </>
      )}
    </div>
  );
}
