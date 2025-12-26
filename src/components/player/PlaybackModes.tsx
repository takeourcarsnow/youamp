// Shuffle and Repeat mode buttons

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { cn } from '@/lib/utils';

interface PlaybackModesProps {
  className?: string;
}

export function PlaybackModes({ className }: PlaybackModesProps) {
  const { shuffleMode, repeatMode, toggleShuffleMode, toggleRepeatMode } =
    usePlayerStore();

  return (
    <div className={cn('playback-modes flex items-center gap-px', className)}>
      {/* Shuffle */}
      <button
        onClick={toggleShuffleMode}
        className={cn(
          'mode-button',
          shuffleMode === 'on' && 'mode-button-active'
        )}
        title={`Shuffle: ${shuffleMode === 'on' ? 'On' : 'Off'} (S)`}
      >
        <span className="text-[6px]">SHUF</span>
      </button>

      {/* Repeat */}
      <button
        onClick={toggleRepeatMode}
        className={cn(
          'mode-button',
          repeatMode !== 'none' && 'mode-button-active'
        )}
        title={`Repeat: ${repeatMode === 'none' ? 'Off' : repeatMode === 'one' ? 'One' : 'All'} (R)`}
      >
        <span className="text-[6px]">
          {repeatMode === 'one' ? 'REP1' : 'REP'}
        </span>
      </button>
    </div>
  );
}
