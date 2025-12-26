// Player store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track, RepeatMode, ShuffleMode, PlaybackSpeed } from '@/types';

interface PlayerStore {
  // Current state
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  isLoading: boolean;
  playbackSpeed: PlaybackSpeed;

  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleRepeatMode: () => void;
  setShuffleMode: (mode: ShuffleMode) => void;
  toggleShuffleMode: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;

  // Queue management
  addToQueue: (track: Track) => void;
  addMultipleToQueue: (tracks: Track[]) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  playTrack: (track: Track) => void;
  playTrackAtIndex: (index: number) => void;

  // Queue operations (add to front)
  addToQueueNext: (track: Track) => void;
  addMultipleToQueueNext: (tracks: Track[]) => void;

  // Utility
  getNextTrack: () => Track | null;
  getPreviousTrack: () => Track | null;
  getShuffledQueue: () => Track[];
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTrack: null,
      queue: [],
      history: [],
      isPlaying: false,
      volume: 75,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      repeatMode: 'none',
      shuffleMode: 'off',
      isLoading: false,
      playbackSpeed: 1,

      // Basic setters
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      toggleRepeatMode: () =>
        set((state) => {
          const modes: RepeatMode[] = ['none', 'all', 'one'];
          const currentIndex = modes.indexOf(state.repeatMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          return { repeatMode: modes[nextIndex] };
        }),
      setShuffleMode: (mode) => set({ shuffleMode: mode }),
      toggleShuffleMode: () =>
        set((state) => ({
          shuffleMode: state.shuffleMode === 'off' ? 'on' : 'off',
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

      // Queue management
      addToQueue: (track) =>
        set((state) => ({ queue: [...state.queue, track] })),
      addMultipleToQueue: (tracks) =>
        set((state) => ({ queue: [...state.queue, ...tracks] })),
      addToQueueNext: (track) =>
        set((state) => {
          const currentIndex = state.currentTrack
            ? state.queue.findIndex((t) => t.id === state.currentTrack!.id)
            : -1;
          const newQueue = [...state.queue];
          newQueue.splice(currentIndex + 1, 0, track);
          return { queue: newQueue };
        }),
      addMultipleToQueueNext: (tracks) =>
        set((state) => {
          const currentIndex = state.currentTrack
            ? state.queue.findIndex((t) => t.id === state.currentTrack!.id)
            : -1;
          const newQueue = [...state.queue];
          newQueue.splice(currentIndex + 1, 0, ...tracks);
          return { queue: newQueue };
        }),
      removeFromQueue: (trackId) =>
        set((state) => ({
          queue: state.queue.filter((t) => t.id !== trackId),
        })),
      clearQueue: () => set({ queue: [] }),
      reorderQueue: (fromIndex, toIndex) =>
        set((state) => {
          const newQueue = [...state.queue];
          const [removed] = newQueue.splice(fromIndex, 1);
          newQueue.splice(toIndex, 0, removed);
          return { queue: newQueue };
        }),

      // Navigation
      playNext: () => {
        const { currentTrack, queue, repeatMode, shuffleMode, history } = get();

        if (!currentTrack) return;

        // Add current track to history
        const newHistory = [currentTrack, ...history].slice(0, 50);

        // Get next track
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

        let nextTrack: Track | null = null;

        if (repeatMode === 'one') {
          nextTrack = currentTrack;
        } else if (shuffleMode === 'on') {
          const remainingTracks = queue.filter((t) => t.id !== currentTrack.id);
          if (remainingTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingTracks.length);
            nextTrack = remainingTracks[randomIndex];
          } else if (repeatMode === 'all') {
            nextTrack = queue[Math.floor(Math.random() * queue.length)];
          }
        } else {
          if (currentIndex < queue.length - 1) {
            nextTrack = queue[currentIndex + 1];
          } else if (repeatMode === 'all' && queue.length > 0) {
            nextTrack = queue[0];
          }
        }

        set({
          currentTrack: nextTrack,
          history: newHistory,
          currentTime: 0,
          isPlaying: nextTrack !== null,
        });
      },

      playPrevious: () => {
        const { currentTrack, queue, currentTime, history } = get();

        // If more than 3 seconds into the track, restart it
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        // Try to get from history first
        if (history.length > 0) {
          const previousTrack = history[0];
          const newHistory = history.slice(1);
          set({
            currentTrack: previousTrack,
            history: newHistory,
            currentTime: 0,
            isPlaying: true,
          });
          return;
        }

        // Otherwise go to previous in queue
        if (!currentTrack) return;
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex > 0) {
          set({
            currentTrack: queue[currentIndex - 1],
            currentTime: 0,
            isPlaying: true,
          });
        }
      },

      playTrack: (track) => {
        const { currentTrack, history } = get();
        const newHistory = currentTrack
          ? [currentTrack, ...history].slice(0, 50)
          : history;

        set({
          currentTrack: track,
          history: newHistory,
          currentTime: 0,
          isPlaying: true,
          isLoading: true,
        });
      },

      playTrackAtIndex: (index) => {
        const { queue } = get();
        if (index >= 0 && index < queue.length) {
          get().playTrack(queue[index]);
        }
      },

      // Utility functions
      getNextTrack: () => {
        const { currentTrack, queue, repeatMode, shuffleMode } = get();
        if (!currentTrack) return queue[0] || null;

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);

        if (repeatMode === 'one') return currentTrack;

        if (shuffleMode === 'on') {
          const remainingTracks = queue.filter((t) => t.id !== currentTrack.id);
          if (remainingTracks.length > 0) {
            return remainingTracks[Math.floor(Math.random() * remainingTracks.length)];
          }
          return repeatMode === 'all' ? queue[Math.floor(Math.random() * queue.length)] : null;
        }

        if (currentIndex < queue.length - 1) {
          return queue[currentIndex + 1];
        }

        return repeatMode === 'all' ? queue[0] : null;
      },

      getPreviousTrack: () => {
        const { currentTrack, queue, history } = get();
        if (history.length > 0) return history[0];
        if (!currentTrack) return null;

        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        return currentIndex > 0 ? queue[currentIndex - 1] : null;
      },

      getShuffledQueue: () => {
        const { queue } = get();
        const shuffled = [...queue];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      },
    }),
    {
      name: 'youamp-player-storage',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        queue: state.queue,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  )
);
