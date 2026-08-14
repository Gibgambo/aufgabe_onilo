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
import { RecordingPanel } from "../player/RecordingPanel";
import {
  ghostControlButtonClass,
  primaryControlButtonClass,
  secondaryControlButtonClass,
} from "../player/playerStyles";
import {
  MuteIcon,
  NextChapterIcon,
  PauseIcon,
  PlayIcon,
  PreviousChapterIcon,
  VolumeIcon,
} from "../player/icons";

function StatusMessage({ text }: { text: string }) {
  return (
    <p
      role="status"
      className="font-display text-onilo-primary text-2xl font-semibold text-center"
    >
      {text}
    </p>
  );
}

function PlayPauseButton() {
  const isPaused = useMediaState("paused");
  return (
    <PlayButton
      className={primaryControlButtonClass}
      aria-label={isPaused ? "Abspielen" : "Pause"}
    >
      {isPaused ? <PlayIcon className="h-9 w-9" /> : <PauseIcon className="h-9 w-9" />}
    </PlayButton>
  );
}

function MuteToggleButton() {
  const isMuted = useMediaState("muted");
  return (
    <MuteButton
      className={ghostControlButtonClass}
      aria-label={isMuted ? "Ton aktivieren" : "Ton stummschalten"}
    >
      {isMuted ? <MuteIcon className="h-7 w-7" /> : <VolumeIcon className="h-7 w-7" />}
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
      className={secondaryControlButtonClass}
      aria-label={label}
      onClick={handleClick}
    >
      {direction === "previous" ? (
        <PreviousChapterIcon className="h-7 w-7" />
      ) : (
        <NextChapterIcon className="h-7 w-7" />
      )}
    </button>
  );
}

function ChapterPearls({ cuePoints }: { cuePoints: number[] }) {
  const currentTime = useMediaState("currentTime");
  const duration = useMediaState("duration");

  if (!duration || !Number.isFinite(duration)) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {cuePoints
        .filter((cue) => cue > 0)
        .map((cue) => {
          const reached = currentTime >= cue;
          return (
            <span
              key={cue}
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-onilo-stage ${
                reached ? "bg-onilo-honey" : "bg-white/50"
              }`}
              style={{ left: `${(cue / duration) * 100}%` }}
            />
          );
        })}
    </div>
  );
}

function Timeline({ cuePoints }: { cuePoints: number[] }) {
  return (
    <div className="flex w-full items-center gap-4">
      <TimeSlider.Root className="group relative flex h-10 w-full touch-none select-none items-center outline-none">
        <TimeSlider.Track className="relative h-3 w-full rounded-full bg-white/20">
          <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-onilo-secondary" />
          <ChapterPearls cuePoints={cuePoints} />
        </TimeSlider.Track>
        <TimeSlider.Thumb
          className="absolute top-1/2 left-(--slider-fill) h-7 w-7 -translate-x-1/2
      -translate-y-1/2 rounded-full bg-white shadow-md"
        />
      </TimeSlider.Root>
      <div className="font-display flex shrink-0 items-center gap-1 text-lg font-medium text-white tabular-nums">
        <Time type="current" />
        <span className="text-white/50">/</span>
        <Time type="duration" />
      </div>
    </div>
  );
}

function VolumeControl() {
  return (
    <div className="flex items-center gap-3">
      <MuteToggleButton />
      <VolumeSlider.Root className="group relative flex h-10 w-24 touch-none select-none items-center outline-none">
        <VolumeSlider.Track className="relative h-2.5 w-full rounded-full bg-white/20">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-full bg-white/70" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb
          className="absolute top-1/2 left-(--slider-fill) h-5 w-5 -translate-x-1/2
      -translate-y-1/2 rounded-full bg-white shadow"
        />
      </VolumeSlider.Root>
    </div>
  );
}

export function Player() {
  const { videoId } = useParams<{ videoId: string }>();
  const state = useBoardstoryVideo(videoId ?? "");

  return (
    <div className="min-h-screen bg-onilo-background flex flex-col items-center gap-5 px-4 pt-8 pb-16 sm:px-8">
      <h1 className="font-display text-onilo-primary text-sm font-semibold tracking-wide uppercase self-start sm:self-center sm:max-w-6xl sm:w-full">
        Player
      </h1>

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
            className="bg-onilo-stage flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] shadow-xl"
          >
            <MediaProvider />
            <div className="flex flex-col gap-6 p-5 sm:p-7">
              <Timeline cuePoints={state.cuePoints} />
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between">
                <div className="hidden sm:block sm:w-24" aria-hidden="true" />
                <div className="flex items-center gap-4">
                  <ChapterButton
                    cuePoints={state.cuePoints}
                    direction="previous"
                  />
                  <PlayPauseButton />
                  <ChapterButton cuePoints={state.cuePoints} direction="next" />
                </div>
                <VolumeControl />
              </div>
            </div>
          </MediaPlayer>
          <RecordingPanel videoId={videoId ?? ""} />
        </>
      )}
    </div>
  );
}
