// Keyboard shortcuts hook

import { useEffect, useCallback } from 'react';
import { usePlayerStore } from '@/store';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts() {
  const {
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    volume,
    setVolume,
    toggleMute,
    toggleShuffleMode,
    toggleRepeatMode,
  } = usePlayerStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const shortcuts: KeyboardShortcuts = {
        // Space - Play/Pause
        ' ': () => {
          event.preventDefault();
          setIsPlaying(!isPlaying);
        },
        // Arrow Right - Next track
        ArrowRight: () => {
          if (event.ctrlKey || event.metaKey) {
            playNext();
          }
        },
        // Arrow Left - Previous track
        ArrowLeft: () => {
          if (event.ctrlKey || event.metaKey) {
            playPrevious();
          }
        },
        // Arrow Up - Volume up
        ArrowUp: () => {
          event.preventDefault();
          setVolume(Math.min(100, volume + 5));
        },
        // Arrow Down - Volume down
        ArrowDown: () => {
          event.preventDefault();
          setVolume(Math.max(0, volume - 5));
        },
        // M - Mute toggle
        m: () => {
          toggleMute();
        },
        M: () => {
          toggleMute();
        },
        // S - Shuffle toggle
        s: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleShuffleMode();
          }
        },
        S: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleShuffleMode();
          }
        },
        // R - Repeat toggle
        r: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleRepeatMode();
          }
        },
        R: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleRepeatMode();
          }
        },
      };

      const handler = shortcuts[event.key];
      if (handler) {
        handler();
      }
    },
    [
      isPlaying,
      setIsPlaying,
      playNext,
      playPrevious,
      volume,
      setVolume,
      toggleMute,
      toggleShuffleMode,
      toggleRepeatMode,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
