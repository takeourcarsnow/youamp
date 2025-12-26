// Volume control component

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { WinampSlider } from '@/components/ui';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function VolumeControl({
  className,
  orientation = 'horizontal',
}: VolumeControlProps) {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div
      className={cn(
        'volume-control flex items-center gap-2',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="volume-icon"
        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
      >
        {isMuted || volume === 0 ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : volume < 50 ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>

      {/* Volume slider */}
      <WinampSlider
        value={displayVolume}
        min={0}
        max={100}
        onChange={(value) => {
          if (isMuted && value > 0) {
            toggleMute();
          }
          setVolume(value);
        }}
        orientation={orientation}
        className={cn(
          orientation === 'horizontal' ? 'w-[68px]' : 'h-[50px]'
        )}
      />
    </div>
  );
}
