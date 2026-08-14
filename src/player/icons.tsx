type IconProps = {
  className?: string;
};

const shared = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M7 5.5v13c0 .8.87 1.3 1.56.9l10.5-6.5a1.05 1.05 0 0 0 0-1.8l-10.5-6.5A1.05 1.05 0 0 0 7 5.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="6.5" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PreviousChapterIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M7 6v12" />
      <path d="M9 12l8.7-5.1c.7-.4 1.3.1 1.3.9v8.4c0 .8-.6 1.3-1.3.9L9 12Z" fill="currentColor" />
    </svg>
  );
}

export function NextChapterIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M17 6v12" />
      <path d="M15 12 6.3 6.9c-.7-.4-1.3.1-1.3.9v8.4c0 .8.6 1.3 1.3.9L15 12Z" fill="currentColor" />
    </svg>
  );
}

export function VolumeIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 9.5v5a1 1 0 0 0 1 1h2.6l4.1 3.4c.6.5 1.5.1 1.5-.7V6.8c0-.8-.9-1.2-1.5-.7L7.6 9.5H5a1 1 0 0 0-1 1Z" fill="currentColor" stroke="none" />
      <path d="M16.2 9c.9.9 1.4 2 1.4 3s-.5 2.1-1.4 3" />
      <path d="M18.6 6.6c1.6 1.6 2.4 3.4 2.4 5.4s-.8 3.8-2.4 5.4" />
    </svg>
  );
}

export function MuteIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 9.5v5a1 1 0 0 0 1 1h2.6l4.1 3.4c.6.5 1.5.1 1.5-.7V6.8c0-.8-.9-1.2-1.5-.7L7.6 9.5H5a1 1 0 0 0-1 1Z" fill="currentColor" stroke="none" />
      <path d="M16.5 9.5l4 4" />
      <path d="M20.5 9.5l-4 4" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="9" y="3.5" width="6" height="10.5" rx="3" fill="currentColor" stroke="none" />
      <path d="M6 11.5a6 6 0 0 0 12 0" />
      <path d="M12 17.5v3" />
      <path d="M9 20.5h6" />
    </svg>
  );
}

export function StopIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <rect x="6" y="6" width="12" height="12" rx="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
