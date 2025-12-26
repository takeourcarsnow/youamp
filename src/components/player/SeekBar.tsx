// Seek bar / position slider

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { WinampSlider } from '@/components/ui';
import { seekTo } from './YouTubePlayerWrapper';
import { cn } from '@/lib/utils';

interface SeekBarProps {
  className?: string;
}

export function SeekBar({ className }: SeekBarProps) {
  const { currentTime, duration, currentTrack } = usePlayerStore();

  const handleSeek = (value: number) => {
    if (duration > 0) {
      const newTime = (value / 100) * duration;
      seekTo(newTime);
    }
  };

  const position = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <WinampSlider
      value={position}
      min={0}
      max={100}
      onChange={handleSeek}
      orientation="horizontal"
      className={cn('seek-bar w-full', !currentTrack && 'opacity-50', className)}
    />
  );
}
