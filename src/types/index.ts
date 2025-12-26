// Main types for the YouAmp application

export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  genre: Genre;
  thumbnail: string;
  addedAt: Date;
}

export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export type VisualizationMode = 'bars' | 'wave' | 'spectrum' | 'oscilloscope' | 'circle';

export type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'cyan' | 'pink';

export const THEME_COLORS: { name: ThemeColor; hex: string }[] = [
  { name: 'green', hex: '#00ff00' },
  { name: 'blue', hex: '#00aaff' },
  { name: 'purple', hex: '#aa00ff' },
  { name: 'orange', hex: '#ff8800' },
  { name: 'red', hex: '#ff0044' },
  { name: 'cyan', hex: '#00ffff' },
  { name: 'pink', hex: '#ff00aa' },
];

export type Genre =
  | 'rock'
  | 'pop'
  | 'electronic'
  | 'hip-hop'
  | 'jazz'
  | 'classical'
  | 'metal'
  | 'indie'
  | 'r&b'
  | 'country'
  | 'ambient'
  | 'other';

export const GENRES: Genre[] = [
  'rock',
  'pop',
  'electronic',
  'hip-hop',
  'jazz',
  'classical',
  'metal',
  'indie',
  'r&b',
  'country',
  'ambient',
  'other',
];

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export type RepeatMode = 'none' | 'one' | 'all';

export type ShuffleMode = 'off' | 'on';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number; // 0-100
  isMuted: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  isLoading: boolean;
}

export interface EqualizerBand {
  frequency: string;
  gain: number; // -12 to +12
}

export interface EqualizerPreset {
  name: string;
  bands: number[];
}

export const EQUALIZER_FREQUENCIES = [
  '60',
  '170',
  '310',
  '600',
  '1K',
  '3K',
  '6K',
  '12K',
  '14K',
  '16K',
];

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', bands: [5, 4, 3, 1, -1, -1, 0, 2, 3, 4] },
  { name: 'Pop', bands: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2] },
  { name: 'Jazz', bands: [4, 3, 1, 2, -2, -2, 0, 1, 3, 4] },
  { name: 'Classical', bands: [5, 4, 3, 2, -1, -1, 0, 2, 3, 5] },
  { name: 'Electronic', bands: [4, 3, 0, -2, -2, 0, 2, 4, 5, 5] },
  { name: 'Bass Boost', bands: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Treble Boost', bands: [0, 0, 0, 0, 0, 0, 2, 4, 5, 6] },
];

export type Theme = 'dark' | 'light';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowState {
  isOpen: boolean;
  position: WindowPosition;
  isMinimized: boolean;
}

export type WindowName = 
  | 'mainWindow' 
  | 'equalizerWindow' 
  | 'playlistWindow' 
  | 'browserWindow'
  | 'lyricsWindow'
  | 'playlistManagerWindow';

export interface UIState {
  theme: Theme;
  themeColor: ThemeColor;
  mainWindow: WindowState;
  equalizerWindow: WindowState;
  playlistWindow: WindowState;
  browserWindow: WindowState;
  lyricsWindow: WindowState;
  playlistManagerWindow: WindowState;
  miniPlayerMode: boolean;
  miniPlayerPosition: WindowPosition;
  visualizationMode: VisualizationMode;
}

export interface SearchFilters {
  query: string;
  genre: Genre | 'all';
  artist: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: number;
}
