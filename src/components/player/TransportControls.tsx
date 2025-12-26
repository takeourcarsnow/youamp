// Transport controls (play, pause, stop, prev, next)

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { cn } from '@/lib/utils';

interface TransportControlsProps {
  className?: string;
  compact?: boolean;
}

export function TransportControls({ className, compact = false }: TransportControlsProps) {
  const {
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    currentTrack,
    setCurrentTime,
  } = usePlayerStore();

  const handlePlay = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // Dispatch seek event to actually reset position
    window.dispatchEvent(
      new CustomEvent('youamp:seek', { detail: { time: 0 } })
    );
  };

  const handlePrevious = () => {
    playPrevious();
  };

  const handleNext = () => {
    playNext();
  };

  // Classic Winamp-style button icons
  const PrevIcon = () => (
    <svg viewBox="0 0 16 14" className="w-3 h-3 fill-current">
      <path d="M0 0h3v14H0zM4 7l12-7v14z" />
    </svg>
  );

  const PlayIcon = () => (
    <svg viewBox="0 0 12 14" className="w-3 h-3 fill-current">
      <path d="M0 0l12 7-12 7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg viewBox="0 0 12 14" className="w-3 h-3 fill-current">
      <path d="M0 0h4v14H0zM8 0h4v14H8z" />
    </svg>
  );

  const StopIcon = () => (
    <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
      <rect width="12" height="12" />
    </svg>
  );

  const NextIcon = () => (
    <svg viewBox="0 0 16 14" className="w-3 h-3 fill-current">
      <path d="M0 0l12 7-12 7zM13 0h3v14h-3z" />
    </svg>
  );

  const EjectIcon = () => (
    <svg viewBox="0 0 14 12" className="w-3 h-2.5 fill-current">
      <path d="M7 0l7 7H0zM0 9h14v3H0z" />
    </svg>
  );

  // Compact mode: only prev, play/pause, next
  if (compact) {
    return (
      <div className={cn('transport-controls flex items-center gap-px', className)}>
        <button
          onClick={handlePrevious}
          className="transport-button"
          title="Previous"
          disabled={!currentTrack}
        >
          <PrevIcon />
        </button>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={cn('transport-button', isPlaying && 'active')}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={!currentTrack}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={handleNext}
          className="transport-button"
          title="Next"
          disabled={!currentTrack}
        >
          <NextIcon />
        </button>
      </div>
    );
  }

  return (
    <div className={cn('transport-controls flex items-center gap-px', className)}>
      {/* Previous */}
      <button
        onClick={handlePrevious}
        className="transport-button"
        title="Previous (Ctrl+←)"
        disabled={!currentTrack}
      >
        <PrevIcon />
      </button>

      {/* Play */}
      <button
        onClick={handlePlay}
        className={cn('transport-button', isPlaying && 'active')}
        title="Play (Space)"
        disabled={!currentTrack}
      >
        <PlayIcon />
      </button>

      {/* Pause */}
      <button
        onClick={handlePause}
        className={cn('transport-button', !isPlaying && currentTrack && 'active')}
        title="Pause (Space)"
        disabled={!currentTrack}
      >
        <PauseIcon />
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        className="transport-button"
        title="Stop"
        disabled={!currentTrack}
      >
        <StopIcon />
      </button>

      {/* Next */}
      <button
        onClick={handleNext}
        className="transport-button"
        title="Next (Ctrl+→)"
        disabled={!currentTrack}
      >
        <NextIcon />
      </button>
    </div>
  );
}
