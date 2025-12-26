// Main Player Window - combines all player components

'use client';

import React, { useState } from 'react';
import { WinampWindow, Visualization } from '@/components/ui';
import {
  TransportControls,
  VolumeControl,
  SeekBar,
  TimeDisplay,
  TrackInfo,
  PlaybackModes,
  BitrateDisplay,
} from '@/components/player';
import { usePlayerStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';

export function MainWindow() {
  const { mainWindow, setWindowPosition, toggleWindow, theme, toggleTheme } = useUIStore();
  const { isPlaying, currentTrack } = usePlayerStore();
  const [showRemaining, setShowRemaining] = useState(false);

  if (!mainWindow.isOpen) return null;

  return (
    <WinampWindow
      title="YouAmp"
      position={mainWindow.position}
      onPositionChange={(pos) => setWindowPosition('mainWindow', pos)}
      onClose={() => toggleWindow('mainWindow')}
      width={275}
      extraButtons={
        <button
          onClick={toggleTheme}
          className="winamp-button w-[9px] h-[9px] mr-1"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span className="text-[8px] leading-none">
            {theme === 'dark' ? '☀' : '☾'}
          </span>
        </button>
      }
    >
      <div className="main-window-content">
        {/* Top section: Time and Visualization */}
        <div className="flex items-start gap-2 mb-2">
          {/* Time Display */}
          <div 
            className="cursor-pointer" 
            onClick={() => setShowRemaining(!showRemaining)}
            title="Click to toggle elapsed/remaining"
          >
            <TimeDisplay showRemaining={showRemaining} />
          </div>

          {/* Visualization */}
          <div className="flex-1 bg-black/50 rounded overflow-hidden">
            <Visualization isPlaying={isPlaying} barCount={19} />
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-2 px-1 py-1 bg-black/30 rounded">
          <TrackInfo />
        </div>

        {/* Bitrate display */}
        <div className="mb-2">
          <BitrateDisplay />
        </div>

        {/* Seek Bar */}
        <div className="mb-2">
          <SeekBar />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          {/* Transport Controls */}
          <TransportControls />

          {/* Playback Modes */}
          <PlaybackModes />

          {/* Volume */}
          <VolumeControl />
        </div>

        {/* Current Track Thumbnail (small) */}
        {currentTrack && (
          <div className="mt-2 flex items-center gap-2 p-1 bg-black/20 rounded">
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#00ff00] truncate">
                {currentTrack.title}
              </div>
              <div className="text-xs text-[#00aa00] truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>
        )}
      </div>
    </WinampWindow>
  );
}
