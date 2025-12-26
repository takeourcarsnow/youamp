// Main Player Window - combines all player components

'use client';

import React, { useState } from 'react';
import { WinampWindow, EnhancedVisualization } from '@/components/ui';
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
import { VisualizationMode } from '@/types';

export function MainWindow() {
  const { mainWindow, setWindowPosition, toggleWindow, theme, toggleTheme, visualizationMode, setVisualizationMode, toggleMiniPlayer } = useUIStore();
  const { isPlaying, currentTrack } = usePlayerStore();
  const [showRemaining, setShowRemaining] = useState(false);

  if (!mainWindow.isOpen) return null;

  return (
    <WinampWindow
      title="YOUAMP"
      position={mainWindow.position}
      onPositionChange={(pos) => setWindowPosition('mainWindow', pos)}
      onClose={() => toggleWindow('mainWindow')}
      width={275}
      extraButtons={
        <>
          <button
            onClick={toggleMiniPlayer}
            className="winamp-button w-[9px] h-[9px] mr-0.5"
            title="Mini player mode"
          >
            <span className="text-[6px] leading-none">_</span>
          </button>
          <button
            onClick={toggleTheme}
            className="winamp-button w-[9px] h-[9px] mr-0.5"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className="text-[6px] leading-none">◐</span>
          </button>
        </>
      }
    >
      <div className="main-window-content">
        {/* Classic Winamp Display Area */}
        <div className="winamp-display mb-1">
          <div className="flex gap-1">
            {/* Left side: Time Display and indicators */}
            <div className="flex flex-col">
              {/* Time Display */}
              <div 
                className="cursor-pointer select-none" 
                onClick={() => setShowRemaining(!showRemaining)}
                title="Click to toggle elapsed/remaining"
              >
                <TimeDisplay showRemaining={showRemaining} />
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center gap-1 mt-1">
                <div className={cn(
                  "indicator-led",
                  isPlaying && "active"
                )} title="Playing" />
                <span className="text-[7px] text-[#00aa00] uppercase font-bold">
                  {isPlaying ? 'Play' : 'Stop'}
                </span>
              </div>
            </div>

            {/* Right side: Visualization */}
            <div className="flex-1">
              <EnhancedVisualization 
                isPlaying={isPlaying} 
                barCount={20}
                mode={visualizationMode}
                onModeChange={(mode: VisualizationMode) => setVisualizationMode(mode)}
              />
            </div>
          </div>
          
          {/* Track Info Marquee */}
          <div className="mt-1 border-t border-[#1a1a1a] pt-1">
            <TrackInfo />
          </div>
          
          {/* Bitrate/Frequency Display */}
          <div className="flex items-center justify-between mt-1">
            <BitrateDisplay />
            <div className="flex gap-2">
              <div className="flex items-center gap-0.5">
                <div className="indicator-led active" />
                <span className="kbps-display">Stereo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="mb-1 px-1">
          <SeekBar />
        </div>

        {/* Bottom Controls Row */}
        <div className="flex items-center justify-between px-1 py-1">
          {/* Transport Controls */}
          <TransportControls />

          {/* Playback Modes */}
          <div className="flex items-center gap-0.5">
            <PlaybackModes />
          </div>

          {/* Volume & Balance */}
          <VolumeControl />
        </div>
      </div>
    </WinampWindow>
  );
}
