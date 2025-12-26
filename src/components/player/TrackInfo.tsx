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
    ? 'Loading...'
    : currentTrack
    ? `${currentTrack.artist} - ${currentTrack.title}`
    : 'No track loaded';

  return (
    <div className={cn('track-info', className)}>
      <MarqueeText
        text={displayText}
        maxLength={30}
        className="text-[#00ff00] text-sm"
      />
    </div>
  );
}
