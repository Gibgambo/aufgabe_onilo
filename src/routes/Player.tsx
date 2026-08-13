import { useParams } from "react-router";
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

      {state.status === "ready" && (
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
      )}
    </div>
  );
}
