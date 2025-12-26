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

  const buttonClass = compact 
    ? 'transport-button w-6 h-5' 
    : 'transport-button';

  const iconClass = compact ? 'w-3 h-3 fill-current' : 'w-4 h-4 fill-current';

  // Compact mode: only prev, play/pause, next
  if (compact) {
    return (
      <div className={cn('transport-controls flex items-center gap-0.5', className)}>
        <button
          onClick={handlePrevious}
          className={buttonClass}
          title="Previous"
          disabled={!currentTrack}
        >
          <svg viewBox="0 0 24 24" className={iconClass}>
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={cn(buttonClass, isPlaying && 'active')}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={!currentTrack}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className={iconClass}>
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={iconClass}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleNext}
          className={buttonClass}
          title="Next"
          disabled={!currentTrack}
        >
          <svg viewBox="0 0 24 24" className={iconClass}>
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={cn('transport-controls flex items-center gap-1', className)}>
      {/* Previous */}
      <button
        onClick={handlePrevious}
        className="transport-button"
        title="Previous (Ctrl+←)"
        disabled={!currentTrack}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* Play */}
      <button
        onClick={handlePlay}
        className={cn('transport-button', isPlaying && 'active')}
        title="Play (Space)"
        disabled={!currentTrack}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Pause */}
      <button
        onClick={handlePause}
        className={cn('transport-button', !isPlaying && currentTrack && 'active')}
        title="Pause (Space)"
        disabled={!currentTrack}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        className="transport-button"
        title="Stop"
        disabled={!currentTrack}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M6 6h12v12H6z" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={handleNext}
        className="transport-button"
        title="Next (Ctrl+→)"
        disabled={!currentTrack}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
}
