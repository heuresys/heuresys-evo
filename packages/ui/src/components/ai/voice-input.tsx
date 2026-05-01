'use client';

import * as React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

/**
 * VoiceInput — Web Speech API recognition + waveform visualization.
 * Falls back gracefully when SpeechRecognition is unavailable (Safari etc.).
 * (TIER 8)
 */
export function VoiceInput({
  onTranscript,
  language = 'it-IT',
  className,
}: {
  onTranscript: (text: string, isFinal: boolean) => void;
  language?: string;
  className?: string;
}) {
  const [recording, setRecording] = React.useState(false);
  const [supported, setSupported] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<unknown>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
    }
  }, []);

  async function start() {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    rec.lang = language;
    rec.continuous = true;
    rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        onTranscript(transcript, event.results[i].isFinal);
      }
    };
    rec.onerror = (e: { error: string }) => setError(e.error);
    rec.onend = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);

    // Setup waveform
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtxRef.current = new AudioContext();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      drawWaveform();
    } catch {
      // Mic permission denied — recognition can still work without waveform
    }
  }

  function stop() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.stop();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    cancelAnimationFrame(rafRef.current);
    setRecording(false);
  }

  function drawWaveform() {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i]! / 255;
        const barHeight = v * canvas.height;
        ctx.fillStyle = `oklch(0.55 0.18 264 / ${0.4 + v * 0.6})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      rafRef.current = requestAnimationFrame(render);
    };
    render();
  }

  if (!supported) {
    return (
      <p role="alert" className={cn('text-xs text-muted-fg', className)}>
        Voice input not supported in this browser.
      </p>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant={recording ? 'destructive' : 'outline'}
        onClick={recording ? stop : start}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
        aria-pressed={recording}
      >
        {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      <canvas
        ref={canvasRef}
        width={200}
        height={32}
        className={cn('rounded bg-muted', !recording && 'opacity-30')}
        aria-hidden="true"
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
