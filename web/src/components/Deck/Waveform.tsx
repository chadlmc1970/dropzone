import React, { useRef, useEffect } from 'react';
import { Track } from '../../types';

interface WaveformProps {
  track: Track | null;
  position: number;
  duration: number;
  deck: 'A' | 'B';
  onSeek?: (position: number) => void;
}

const Waveform: React.FC<WaveformProps> = ({ track, position, duration, deck, onSeek }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = deck === 'A' ? '#06b6d4' : '#f97316'; // cyan-500 : orange-500

  useEffect(() => {
    if (!canvasRef.current || !track) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Generate mock waveform data
    const bars = 100;
    const barWidth = rect.width / bars;
    const maxHeight = rect.height * 0.8;

    for (let i = 0; i < bars; i++) {
      // Mock waveform height (use actual audio data in production)
      const height = Math.random() * maxHeight * 0.5 + maxHeight * 0.3;

      // Determine bar color based on playback position
      const barPosition = (i / bars) * duration;
      const isPassed = barPosition < position;

      ctx.fillStyle = isPassed ? color : `${color}40`; // 40 = 25% opacity
      ctx.fillRect(i * barWidth, (rect.height - height) / 2, barWidth - 1, height);
    }

    // Draw beat markers (every 4 beats, assuming 120 BPM)
    if (track.bpm) {
      const beatDuration = 60 / track.bpm;
      const numBeats = Math.floor(duration / beatDuration);

      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 1;

      for (let i = 0; i < numBeats; i += 4) {
        const x = (i * beatDuration / duration) * rect.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
    }

    // Draw playhead
    const playheadX = (position / duration) * rect.width;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, rect.height);
    ctx.stroke();
  }, [track, position, duration, color]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickPosition = (x / rect.width) * duration;
    onSeek(clickPosition);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-24 cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
};

export default Waveform;
