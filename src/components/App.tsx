// Main App component

'use client';

import React, { useEffect } from 'react';
import { MenuBar, Desktop } from '@/components/layout';
import { ToastProvider, showToast } from '@/components/providers';
import { useKeyboardShortcuts } from '@/hooks';
import { useUIStore, usePlayerStore, useSleepTimerStore } from '@/store';
import { cn } from '@/lib/utils';
import { THEME_COLORS } from '@/types';

export function App() {
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const { theme, themeColor } = useUIStore();
  const { setIsPlaying, currentTrack } = usePlayerStore();
  const { isActive, remainingMinutes, tick, setTimerId, stopTimer } = useSleepTimerStore();

  // Sleep timer effect
  useEffect(() => {
    if (!isActive) return;

    const id = setInterval(() => {
      tick();
    }, 60000); // 1 minute interval

    setTimerId(id);

    return () => clearInterval(id);
  }, [isActive, tick, setTimerId]);

  // Stop playback when sleep timer ends
  useEffect(() => {
    if (isActive && remainingMinutes <= 0) {
      setIsPlaying(false);
      stopTimer();
      showToast.sleepTimerEnded();
    }
  }, [isActive, remainingMinutes, setIsPlaying, stopTimer]);

  // Media Session API integration
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album || '',
      artwork: [
        { src: currentTrack.thumbnail, sizes: '120x90', type: 'image/jpeg' },
      ],
    });
  }, [currentTrack]);

  // Apply theme color as CSS variable
  useEffect(() => {
    const color = THEME_COLORS.find(c => c.name === themeColor)?.hex || '#00ff00';
    document.documentElement.style.setProperty('--accent-color', color);
  }, [themeColor]);

  return (
    <div className={cn('app', theme === 'light' && 'light-theme')}>
      <MenuBar />
      <Desktop />
      <ToastProvider />
    </div>
  );
}
