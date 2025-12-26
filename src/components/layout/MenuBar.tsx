// Menu bar / toolbar component

'use client';

import React from 'react';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

export function MenuBar() {
  const {
    mainWindow,
    equalizerWindow,
    playlistWindow,
    browserWindow,
    toggleWindow,
    resetLayout,
    stackWindows,
    theme,
    toggleTheme,
  } = useUIStore();

  return (
    <div className="menu-bar fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1 bg-[#1a1a2e]/95 backdrop-blur border-b border-[#00ff00]/20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-[#00ff00] font-bold text-lg tracking-wider">
          YouAmp
        </span>
        <span className="text-[10px] text-gray-500">v1.0</span>
      </div>

      {/* Window toggles */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleWindow('mainWindow')}
          className={cn(
            'menu-button',
            mainWindow.isOpen && 'menu-button-active'
          )}
          title="Main Window"
        >
          Main
        </button>
        <button
          onClick={() => toggleWindow('equalizerWindow')}
          className={cn(
            'menu-button',
            equalizerWindow.isOpen && 'menu-button-active'
          )}
          title="Equalizer"
        >
          EQ
        </button>
        <button
          onClick={() => toggleWindow('playlistWindow')}
          className={cn(
            'menu-button',
            playlistWindow.isOpen && 'menu-button-active'
          )}
          title="Playlist"
        >
          PL
        </button>
        <button
          onClick={() => toggleWindow('browserWindow')}
          className={cn(
            'menu-button',
            browserWindow.isOpen && 'menu-button-active'
          )}
          title="Music Browser"
        >
          Browse
        </button>

        <div className="w-px h-4 bg-[#00ff00]/30 mx-2" />

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
      <div className="text-[10px] text-gray-500">
        Space: Play/Pause • M: Mute • S: Shuffle • R: Repeat
      </div>
    </div>
  );
}
