// Track info display

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { MarqueeText } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TrackInfoProps {
  className?: string;
}

export function TrackInfo({ className }: TrackInfoProps) {
  const { currentTrack, isLoading } = usePlayerStore();

  const displayText = isLoading
    ? '*** LOADING ***'
    : currentTrack
    ? `${currentTrack.artist} - ${currentTrack.title}`.toUpperCase()
    : '*** YOUAMP ***  YOUTUBE MUSIC PLAYER';

  return (
    <div className={cn('track-info', className)}>
      <MarqueeText
        text={displayText}
        maxLength={35}
        className="text-[#00ff00] text-[10px] font-bold tracking-wide"
        style={{
          textShadow: '0 0 6px #00ff00',
          fontFamily: 'Consolas, monospace',
        }}
      />
    </div>
  );
}
