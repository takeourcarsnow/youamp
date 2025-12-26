// Toast notification provider and utilities

'use client';

import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)',
          color: '#00ff00',
          border: '1px solid #00ff00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
          fontSize: '12px',
          padding: '8px 12px',
        },
        success: {
          iconTheme: {
            primary: '#00ff00',
            secondary: '#1a1a2e',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4444',
            secondary: '#1a1a2e',
          },
          style: {
            border: '1px solid #ff4444',
            color: '#ff4444',
          },
        },
      }}
    />
  );
}

// Helper functions for common toast messages
export const showToast = {
  trackAdded: (title: string) => toast.success(`Added: ${title}`),
  tracksAdded: (count: number) => toast.success(`Added ${count} tracks to queue`),
  trackRemoved: (title: string) => toast(`Removed: ${title}`, { icon: '🗑️' }),
  playlistCleared: () => toast('Playlist cleared', { icon: '🧹' }),
  playlistCreated: (name: string) => toast.success(`Created playlist: ${name}`),
  playlistDeleted: (name: string) => toast(`Deleted: ${name}`, { icon: '🗑️' }),
  copiedToClipboard: () => toast.success('Copied to clipboard!'),
  sleepTimerSet: (minutes: number) => toast(`Sleep timer: ${minutes} min`, { icon: '😴' }),
  sleepTimerStopped: () => toast('Sleep timer cancelled', { icon: '⏰' }),
  sleepTimerEnded: () => toast('Sleep timer ended - pausing playback', { icon: '😴' }),
  error: (message: string) => toast.error(message),
  shuffleOn: () => toast('Shuffle ON', { icon: '🔀' }),
  shuffleOff: () => toast('Shuffle OFF', { icon: '🔀' }),
  repeatNone: () => toast('Repeat OFF', { icon: '🔁' }),
  repeatAll: () => toast('Repeat ALL', { icon: '🔁' }),
  repeatOne: () => toast('Repeat ONE', { icon: '🔂' }),
  speedChanged: (speed: number) => toast(`Playback speed: ${speed}x`, { icon: '⚡' }),
  lyricsNotFound: () => toast('Lyrics not found', { icon: '📝' }),
};
