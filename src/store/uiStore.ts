// UI store for theme and window management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, WindowState, WindowPosition } from '@/types';

interface UIStore {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Window states
  mainWindow: WindowState;
  equalizerWindow: WindowState;
  playlistWindow: WindowState;
  browserWindow: WindowState;

  // Window actions
  setWindowOpen: (window: WindowName, isOpen: boolean) => void;
  setWindowPosition: (window: WindowName, position: WindowPosition) => void;
  setWindowMinimized: (window: WindowName, isMinimized: boolean) => void;
  toggleWindow: (window: WindowName) => void;

  // Layout presets
  resetLayout: () => void;
  stackWindows: () => void;
}

type WindowName = 'mainWindow' | 'equalizerWindow' | 'playlistWindow' | 'browserWindow';

const defaultWindowStates: Record<WindowName, WindowState> = {
  mainWindow: { isOpen: true, position: { x: 100, y: 100 }, isMinimized: false },
  equalizerWindow: { isOpen: true, position: { x: 100, y: 216 }, isMinimized: false },
  playlistWindow: { isOpen: true, position: { x: 100, y: 332 }, isMinimized: false },
  browserWindow: { isOpen: true, position: { x: 375, y: 100 }, isMinimized: false },
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      // Window states
      ...defaultWindowStates,

      // Window actions
      setWindowOpen: (window, isOpen) =>
        set((state) => ({
          [window]: { ...state[window], isOpen },
        })),

      setWindowPosition: (window, position) =>
        set((state) => ({
          [window]: { ...state[window], position },
        })),

      setWindowMinimized: (window, isMinimized) =>
        set((state) => ({
          [window]: { ...state[window], isMinimized },
        })),

      toggleWindow: (window) =>
        set((state) => ({
          [window]: { ...state[window], isOpen: !state[window].isOpen },
        })),

      // Layout presets
      resetLayout: () =>
        set({
          ...defaultWindowStates,
        }),

      stackWindows: () =>
        set({
          mainWindow: { isOpen: true, position: { x: 100, y: 50 }, isMinimized: false },
          equalizerWindow: { isOpen: true, position: { x: 100, y: 166 }, isMinimized: false },
          playlistWindow: { isOpen: true, position: { x: 100, y: 282 }, isMinimized: false },
          browserWindow: { isOpen: true, position: { x: 375, y: 50 }, isMinimized: false },
        }),
    }),
    {
      name: 'youamp-ui-storage',
    }
  )
);
