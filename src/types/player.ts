// Player-specific types

import { YouTubePlayer } from 'react-youtube';

export interface PlayerRef {
  player: YouTubePlayer | null;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export interface PlayerControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export type PlayerEventType =
  | 'ready'
  | 'play'
  | 'pause'
  | 'end'
  | 'error'
  | 'stateChange'
  | 'timeUpdate';

export interface PlayerEvent {
  type: PlayerEventType;
  data?: unknown;
}

// YouTube IFrame API Player States
export enum YouTubePlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}
