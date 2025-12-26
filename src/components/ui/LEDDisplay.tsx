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

// Classic 7-segment LED style font mapping
const LED_SEGMENTS: Record<string, string> = {
  '0': '█▀█\n█▄█',
  '1': '  █\n  █',
  '2': '▀▀█\n█▄▄',
  '3': '▀▀█\n▄▄█',
  '4': '█ █\n▀▀█',
  '5': '█▀▀\n▄▄█',
  '6': '█▀▀\n█▄█',
  '7': '▀▀█\n  █',
  '8': '█▀█\n█▄█',
  '9': '█▀█\n▄▄█',
  ':': ' \n•',
  '-': '   \n▀▀▀',
  ' ': '   \n   ',
};

export function LEDDisplay({
  value,
  className,
  size = 'medium',
  color = 'green',
}: LEDDisplayProps) {
  const colorClass = {
    green: 'text-[#00ff00]',
    red: 'text-[#ff0000]',
    amber: 'text-[#ffaa00]',
  }[color];

  const shadowColor = {
    green: '#00ff00',
    red: '#ff0000',
    amber: '#ffaa00',
  }[color];

  const bgColor = {
    green: '#003300',
    red: '#330000',
    amber: '#332200',
  }[color];

  const sizeStyles = {
    small: { fontSize: '12px', letterSpacing: '1px' },
    medium: { fontSize: '20px', letterSpacing: '2px' },
    large: { fontSize: '28px', letterSpacing: '3px' },
  }[size];

  return (
    <div
      className={cn(
        'led-display font-mono font-bold tracking-wider relative px-1',
        colorClass,
        className
      )}
      style={{
        ...sizeStyles,
        textShadow: `0 0 8px ${shadowColor}, 0 0 16px ${shadowColor}`,
        background: `linear-gradient(180deg, ${bgColor} 0%, #000 100%)`,
        border: '1px solid',
        borderColor: '#000 #2a2a2a #2a2a2a #000',
      }}
    >
      {/* Background "off" segments for depth */}
      <span 
        className="absolute inset-0 px-1 opacity-20"
        style={{ ...sizeStyles, color: bgColor }}
      >
        {value.replace(/[^:]/g, '8')}
      </span>
      {/* Active segments */}
      <span className="relative">{value}</span>
    </div>
  );
}
