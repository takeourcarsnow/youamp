// Marquee text component for scrolling track titles

'use client';

import React from 'react';
import { useMarquee } from '@/hooks';
import { cn } from '@/lib/utils';

interface MarqueeTextProps {
  text: string;
  maxLength?: number;
  speed?: number;
  className?: string;
}

export function MarqueeText({
  text,
  maxLength = 30,
  speed = 150,
  className,
}: MarqueeTextProps) {
  const { displayText, handleMouseEnter, handleMouseLeave } = useMarquee({
    text,
    maxLength,
    speed,
    pauseOnHover: true,
  });

  return (
    <div
      className={cn('font-mono overflow-hidden whitespace-nowrap', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={text}
    >
      {displayText}
    </div>
  );
}
