// Bitrate/quality display (cosmetic for Winamp look)

'use client';

import React from 'react';
import { LEDDisplay } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BitrateDisplayProps {
  className?: string;
}

export function BitrateDisplay({ className }: BitrateDisplayProps) {
  return (
    <div className={cn('bitrate-display flex gap-2', className)}>
      <LEDDisplay value="192" size="small" color="green" />
      <span className="text-[#00ff00] text-xs">kbps</span>
      <LEDDisplay value="44" size="small" color="green" />
      <span className="text-[#00ff00] text-xs">kHz</span>
    </div>
  );
}
