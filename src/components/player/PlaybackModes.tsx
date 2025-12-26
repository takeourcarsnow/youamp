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
    <div className={cn('playback-modes flex items-center gap-2', className)}>
      {/* Shuffle */}
      <button
        onClick={toggleShuffleMode}
        className={cn(
          'mode-button',
          shuffleMode === 'on' && 'mode-button-active'
        )}
        title={`Shuffle: ${shuffleMode === 'on' ? 'On' : 'Off'} (S)`}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
        </svg>
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
        {repeatMode === 'one' ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        )}
      </button>
    </div>
  );
}
