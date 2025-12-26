// Keyboard shortcuts hook

import { useEffect, useCallback } from 'react';
import { usePlayerStore, useUIStore } from '@/store';
import { showToast } from '@/components/providers/ToastProvider';

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
    shuffleMode,
    repeatMode,
    currentTrack,
    currentTime,
  } = usePlayerStore();

  const {
    toggleWindow,
    toggleMiniPlayer,
    toggleTheme,
  } = useUIStore();

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
        // Arrow Right - Next track (with Ctrl)
        ArrowRight: () => {
          if (event.ctrlKey || event.metaKey) {
            playNext();
          }
        },
        // Arrow Left - Previous track (with Ctrl)
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
        m: () => toggleMute(),
        M: () => toggleMute(),
        // S - Shuffle toggle
        s: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleShuffleMode();
            showToast[shuffleMode === 'off' ? 'shuffleOn' : 'shuffleOff']();
          }
        },
        S: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleShuffleMode();
            showToast[shuffleMode === 'off' ? 'shuffleOn' : 'shuffleOff']();
          }
        },
        // R - Repeat toggle
        r: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleRepeatMode();
            const nextMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
            showToast[nextMode === 'all' ? 'repeatAll' : nextMode === 'one' ? 'repeatOne' : 'repeatNone']();
          }
        },
        R: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleRepeatMode();
            const nextMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
            showToast[nextMode === 'all' ? 'repeatAll' : nextMode === 'one' ? 'repeatOne' : 'repeatNone']();
          }
        },
        // 1-5 - Toggle windows
        '1': () => toggleWindow('mainWindow'),
        '2': () => toggleWindow('equalizerWindow'),
        '3': () => toggleWindow('playlistWindow'),
        '4': () => toggleWindow('browserWindow'),
        '5': () => toggleWindow('lyricsWindow'),
        // Escape - Toggle mini player
        Escape: () => toggleMiniPlayer(),
        // T - Toggle theme
        t: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleTheme();
          }
        },
        T: () => {
          if (!event.ctrlKey && !event.metaKey) {
            toggleTheme();
          }
        },
        // C - Copy link
        c: () => {
          if (!event.ctrlKey && !event.metaKey && currentTrack) {
            const timestamp = Math.floor(currentTime);
            const url = `https://youtube.com/watch?v=${currentTrack.youtubeId}${timestamp > 0 ? `&t=${timestamp}` : ''}`;
            navigator.clipboard.writeText(url);
            showToast.copiedToClipboard();
          }
        },
        C: () => {
          if (!event.ctrlKey && !event.metaKey && currentTrack) {
            const timestamp = Math.floor(currentTime);
            const url = `https://youtube.com/watch?v=${currentTrack.youtubeId}${timestamp > 0 ? `&t=${timestamp}` : ''}`;
            navigator.clipboard.writeText(url);
            showToast.copiedToClipboard();
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
      shuffleMode,
      repeatMode,
      toggleWindow,
      toggleMiniPlayer,
      toggleTheme,
      currentTrack,
      currentTime,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
