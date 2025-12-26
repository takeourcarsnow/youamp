// LED Display component (like Winamp's time/frequency display)

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LEDDisplayProps {
  value: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'green' | 'red' | 'amber';
}

export function LEDDisplay({
  value,
  className,
  size = 'medium',
  color = 'green',
}: LEDDisplayProps) {
  return (
    <div
      className={cn(
        'led-display font-mono tracking-wider',
        size === 'small' && 'text-sm',
        size === 'medium' && 'text-lg',
        size === 'large' && 'text-2xl',
        color === 'green' && 'text-[#00ff00]',
        color === 'red' && 'text-[#ff0000]',
        color === 'amber' && 'text-[#ffaa00]',
        className
      )}
    >
      {value}
    </div>
  );
}
