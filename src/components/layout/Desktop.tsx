// Desktop area where windows are rendered

'use client';

import React from 'react';
import { MainWindow, EqualizerWindow, PlaylistWindow, BrowserWindow } from '@/components/windows';
import { YouTubePlayerWrapper } from '@/components/player';

export function Desktop() {
  return (
    <div className="desktop fixed inset-0 pt-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a2e] to-[#0f0f1a]" />
      
      {/* Scanlines overlay for retro effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-scanlines" />

      {/* Windows */}
      <MainWindow />
      <EqualizerWindow />
      <PlaylistWindow />
      <BrowserWindow />

      {/* Hidden YouTube Player */}
      <YouTubePlayerWrapper />
    </div>
  );
}
