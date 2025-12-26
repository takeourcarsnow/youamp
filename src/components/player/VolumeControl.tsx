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

  // Classic Winamp volume icon
  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 fill-current">
          <path d="M0 4h3l4-4v14l-4-4H0V4z" />
          <path d="M9 5l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    } else if (volume < 50) {
      return (
        <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 fill-current">
          <path d="M0 4h3l4-4v14l-4-4H0V4z" />
          <path d="M9 4c1 1 1 5 0 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 fill-current">
        <path d="M0 4h3l4-4v14l-4-4H0V4z" />
        <path d="M9 3c2 2 2 6 0 8M11 1c3 3 3 9 0 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
  };

  return (
    <div
      className={cn(
        'volume-control flex items-center gap-1',
        orientation === 'vertical' && 'flex-col',
        className
      )}
    >
      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="volume-icon p-0.5 hover:text-[#00ff00]"
        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
        style={{
          color: isMuted ? '#666' : '#00ff00',
        }}
      >
        <VolumeIcon />
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
          orientation === 'horizontal' ? 'w-[50px]' : 'h-[50px]'
        )}
      />
    </div>
  );
}
