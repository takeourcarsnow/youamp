// Time display component

'use client';

import React from 'react';
import { usePlayerStore } from '@/store';
import { LEDDisplay } from '@/components/ui';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TimeDisplayProps {
  className?: string;
  showRemaining?: boolean;
}

export function TimeDisplay({ className, showRemaining = false }: TimeDisplayProps) {
  const { currentTime, duration } = usePlayerStore();

  const displayTime = showRemaining ? duration - currentTime : currentTime;
  const prefix = showRemaining && currentTime > 0 ? '-' : '';

  return (
    <LEDDisplay
      value={`${prefix}${formatTime(displayTime)}`}
      size="large"
      color="green"
      className={cn('time-display', className)}
    />
  );
}
