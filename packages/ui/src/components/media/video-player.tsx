'use client';

import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

/**
 * VideoPlayer — accessible HTML5 video with custom controls + chapters slot.
 * Renders captions/track elements when provided. (TIER 7)
 */
export interface VideoChapter {
  start: number; // seconds
  title: string;
}

export interface VideoCaption {
  src: string;
  srcLang: string;
  label: string;
  default?: boolean;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  chapters?: VideoChapter[];
  captions?: VideoCaption[];
  className?: string;
  ariaLabel?: string;
}

export function VideoPlayer({
  src,
  poster,
  chapters,
  captions,
  className,
  ariaLabel = 'Video player',
}: VideoPlayerProps) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  return (
    <div
      className={cn('rounded-md border border-border bg-background', className)}
      role="region"
      aria-label={ariaLabel}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        className="w-full rounded-t-md"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime((e.target as HTMLVideoElement).currentTime)}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
        onVolumeChange={(e) => setMuted((e.target as HTMLVideoElement).muted)}
        controls={false}
      >
        {captions?.map((c) => (
          <track
            key={c.srcLang}
            kind="captions"
            src={c.src}
            srcLang={c.srcLang}
            label={c.label}
            default={c.default}
          />
        ))}
      </video>
      <div className="flex items-center gap-2 border-t border-border p-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            if (ref.current) ref.current.muted = !ref.current.muted;
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={time}
          step={0.1}
          onChange={(e) => {
            const t = Number(e.target.value);
            if (ref.current) ref.current.currentTime = t;
            setTime(t);
          }}
          className="flex-1"
          aria-label="Seek"
        />
        <span className="font-mono text-xs">
          {fmtTime(time)} / {fmtTime(duration)}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => ref.current?.requestFullscreen()}
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      {chapters && chapters.length > 0 ? (
        <ul className="border-t border-border p-2 text-xs">
          {chapters.map((ch, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  if (ref.current) ref.current.currentTime = ch.start;
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-accent"
              >
                <span className="font-mono text-muted-fg">{fmtTime(ch.start)}</span>
                <span>{ch.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function fmtTime(s: number): string {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}
