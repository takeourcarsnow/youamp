// UI store for theme and window management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeColor, WindowState, WindowPosition, VisualizationMode } from '@/types';

type WindowName = 
  | 'mainWindow' 
  | 'equalizerWindow' 
  | 'playlistWindow' 
  | 'browserWindow'
  | 'lyricsWindow'
  | 'playlistManagerWindow';

interface UIStore {
  // Theme
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;

  // Visualization
  visualizationMode: VisualizationMode;
  setVisualizationMode: (mode: VisualizationMode) => void;

  // Mini player
  miniPlayerMode: boolean;
  miniPlayerPosition: WindowPosition;
  toggleMiniPlayer: () => void;
  setMiniPlayerPosition: (position: WindowPosition) => void;

  // Window states
  mainWindow: WindowState;
  equalizerWindow: WindowState;
  playlistWindow: WindowState;
  browserWindow: WindowState;
  lyricsWindow: WindowState;
  playlistManagerWindow: WindowState;

  // Window actions
  setWindowOpen: (window: WindowName, isOpen: boolean) => void;
  setWindowPosition: (window: WindowName, position: WindowPosition) => void;
  setWindowMinimized: (window: WindowName, isMinimized: boolean) => void;
  toggleWindow: (window: WindowName) => void;

  // Layout presets
  resetLayout: () => void;
  stackWindows: () => void;
}

const defaultWindowStates: Record<WindowName, WindowState> = {
  mainWindow: { isOpen: true, position: { x: 100, y: 100 }, isMinimized: false },
  equalizerWindow: { isOpen: true, position: { x: 100, y: 216 }, isMinimized: false },
  playlistWindow: { isOpen: true, position: { x: 100, y: 332 }, isMinimized: false },
  browserWindow: { isOpen: true, position: { x: 375, y: 100 }, isMinimized: false },
  lyricsWindow: { isOpen: false, position: { x: 375, y: 300 }, isMinimized: false },
  playlistManagerWindow: { isOpen: false, position: { x: 450, y: 150 }, isMinimized: false },
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      themeColor: 'green',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setThemeColor: (color) => set({ themeColor: color }),

      // Visualization
      visualizationMode: 'bars',
      setVisualizationMode: (mode) => set({ visualizationMode: mode }),

      // Mini player
      miniPlayerMode: false,
      miniPlayerPosition: { x: 20, y: 20 },
      toggleMiniPlayer: () => set((state) => ({ miniPlayerMode: !state.miniPlayerMode })),
      setMiniPlayerPosition: (position) => set({ miniPlayerPosition: position }),

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
          lyricsWindow: { isOpen: false, position: { x: 375, y: 300 }, isMinimized: false },
          playlistManagerWindow: { isOpen: false, position: { x: 450, y: 150 }, isMinimized: false },
        }),
    }),
    {
      name: 'youamp-ui-storage',
    }
  )
);
