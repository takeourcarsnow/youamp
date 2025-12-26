// Menu bar / toolbar component

'use client';

import React, { useState } from 'react';
import { useUIStore, usePlayerStore, useSleepTimerStore } from '@/store';
import { showToast } from '@/components/providers';
import { cn } from '@/lib/utils';
import { THEME_COLORS, PLAYBACK_SPEEDS, PlaybackSpeed } from '@/types';

export function MenuBar() {
  const {
    mainWindow,
    equalizerWindow,
    playlistWindow,
    browserWindow,
    lyricsWindow,
    playlistManagerWindow,
    toggleWindow,
    resetLayout,
    stackWindows,
    theme,
    toggleTheme,
    themeColor,
    setThemeColor,
    miniPlayerMode,
    toggleMiniPlayer,
  } = useUIStore();

  const { playbackSpeed, setPlaybackSpeed, currentTrack, currentTime } = usePlayerStore();
  const { isActive, remainingMinutes, startTimer, stopTimer } = useSleepTimerStore();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const handleCopyLink = () => {
    if (currentTrack) {
      const timestamp = Math.floor(currentTime);
      const url = `https://youtube.com/watch?v=${currentTrack.youtubeId}${timestamp > 0 ? `&t=${timestamp}` : ''}`;
      navigator.clipboard.writeText(url);
      showToast.copiedToClipboard();
    }
  };

  const handleSetSleepTimer = (minutes: number) => {
    startTimer(minutes);
    showToast.sleepTimerSet(minutes);
    setShowSleepTimer(false);
  };

  const handleCancelSleepTimer = () => {
    stopTimer();
    showToast.sleepTimerStopped();
    setShowSleepTimer(false);
  };

  const handleSpeedChange = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    showToast.speedChanged(speed);
    setShowSpeedMenu(false);
    // Dispatch event for YouTube player
    window.dispatchEvent(new CustomEvent('youamp:speed', { detail: { speed } }));
  };

  return (
    <div className="menu-bar fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1 bg-[#1a1a2e]/95 backdrop-blur border-b border-[#00ff00]/20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-[#00ff00] font-bold text-lg tracking-wider">
          YouAmp
        </span>
        <span className="text-[10px] text-gray-500">v1.1</span>
        {isActive && (
          <span className="text-[10px] text-[#ffaa00] animate-pulse">
            💤 {remainingMinutes}m
          </span>
        )}
      </div>

      {/* Window toggles */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleWindow('mainWindow')}
          className={cn(
            'menu-button',
            mainWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Main Window"
        >
          Main
        </button>
        <button
          onClick={() => toggleWindow('equalizerWindow')}
          className={cn(
            'menu-button',
            equalizerWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Equalizer"
        >
          EQ
        </button>
        <button
          onClick={() => toggleWindow('playlistWindow')}
          className={cn(
            'menu-button',
            playlistWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Playlist"
        >
          PL
        </button>
        <button
          onClick={() => toggleWindow('browserWindow')}
          className={cn(
            'menu-button',
            browserWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Music Browser"
        >
          Browse
        </button>
        <button
          onClick={() => toggleWindow('lyricsWindow')}
          className={cn(
            'menu-button',
            lyricsWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Lyrics"
        >
          Lyrics
        </button>
        <button
          onClick={() => toggleWindow('playlistManagerWindow')}
          className={cn(
            'menu-button',
            playlistManagerWindow.isOpen && !miniPlayerMode && 'menu-button-active'
          )}
          title="Playlist Manager"
        >
          📁
        </button>

        <div className="w-px h-4 bg-[#00ff00]/30 mx-2" />

        {/* Mini player toggle */}
        <button
          onClick={toggleMiniPlayer}
          className={cn('menu-button', miniPlayerMode && 'menu-button-active')}
          title="Toggle Mini Player"
        >
          {miniPlayerMode ? '⬜' : '▪'}
        </button>

        {/* Layout presets */}
        <button
          onClick={stackWindows}
          className="menu-button"
          title="Stack Windows"
        >
          Stack
        </button>
        <button
          onClick={resetLayout}
          className="menu-button"
          title="Reset Layout"
        >
          Reset
        </button>

        <div className="w-px h-4 bg-[#00ff00]/30 mx-2" />

        {/* Speed control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="menu-button"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a2e] border border-[#00ff00]/30 rounded p-1 z-50">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={cn(
                    'block w-full px-3 py-1 text-xs text-left',
                    speed === playbackSpeed ? 'text-[#00ff00]' : 'text-gray-400 hover:text-[#00ff00]'
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sleep timer */}
        <div className="relative">
          <button
            onClick={() => setShowSleepTimer(!showSleepTimer)}
            className={cn('menu-button', isActive && 'menu-button-active')}
            title="Sleep Timer"
          >
            😴
          </button>
          {showSleepTimer && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a2e] border border-[#00ff00]/30 rounded p-1 z-50">
              {[15, 30, 45, 60, 90, 120].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleSetSleepTimer(minutes)}
                  className="block w-full px-3 py-1 text-xs text-gray-400 hover:text-[#00ff00] text-left"
                >
                  {minutes} min
                </button>
              ))}
              {isActive && (
                <button
                  onClick={handleCancelSleepTimer}
                  className="block w-full px-3 py-1 text-xs text-[#ff4444] hover:text-[#ff0000] text-left border-t border-[#00ff00]/20 mt-1"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Share/Copy link */}
        <button
          onClick={handleCopyLink}
          className="menu-button"
          title="Copy YouTube Link"
          disabled={!currentTrack}
        >
          🔗
        </button>

        <div className="w-px h-4 bg-[#00ff00]/30 mx-2" />

        {/* Theme color picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="menu-button"
            title="Theme Color"
          >
            <span 
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: THEME_COLORS.find(c => c.name === themeColor)?.hex }}
            />
          </button>
          {showColorPicker && (
            <div className="absolute top-full right-0 mt-1 bg-[#1a1a2e] border border-[#00ff00]/30 rounded p-2 flex gap-1 z-50">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setThemeColor(color.name);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    'w-5 h-5 rounded-full transition-transform hover:scale-110',
                    themeColor === color.name && 'ring-2 ring-white'
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="menu-button"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-[10px] text-gray-500 hidden lg:block">
        Space: Play/Pause • M: Mute • S: Shuffle • R: Repeat
      </div>
    </div>
  );
}
