// Bitrate/quality display (cosmetic for Winamp look)

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BitrateDisplayProps {
  className?: string;
}

export function BitrateDisplay({ className }: BitrateDisplayProps) {
  return (
    <div className={cn('bitrate-display flex items-center gap-1', className)}>
      <span 
        className="text-[9px] font-bold text-[#00ff00] font-mono"
        style={{ textShadow: '0 0 4px #00ff00' }}
      >
        192
      </span>
      <span className="text-[7px] text-[#00aa00] font-mono">KBPS</span>
      <span 
        className="text-[9px] font-bold text-[#00ff00] font-mono ml-1"
        style={{ textShadow: '0 0 4px #00ff00' }}
      >
        44
      </span>
      <span className="text-[7px] text-[#00aa00] font-mono">KHZ</span>
    </div>
  );
}
