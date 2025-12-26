// YouTube Player wrapper component

'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { usePlayerStore } from '@/store';
import { YouTubePlayerState } from '@/types/player';

interface YouTubePlayerWrapperProps {
  className?: string;
}

export function YouTubePlayerWrapper({ className }: YouTubePlayerWrapperProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const timeUpdateRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setIsLoading,
    playNext,
  } = usePlayerStore();

  // Handle player ready
  const onReady = useCallback(
    async (event: YouTubeEvent) => {
      playerRef.current = event.target;
      
      // Set initial volume
      event.target.setVolume(isMuted ? 0 : volume);
      
      // Get duration
      const duration = await event.target.getDuration();
      if (duration) {
        setDuration(duration);
      }

      setIsLoading(false);
    },
    [volume, isMuted, setDuration, setIsLoading]
  );

  // Handle player state change
  const onStateChange = useCallback(
    async (event: YouTubeEvent) => {
      const state = event.data as YouTubePlayerState;

      switch (state) {
        case YouTubePlayerState.PLAYING:
          setIsPlaying(true);
          setIsLoading(false);
          
          // Start time updates
          if (timeUpdateRef.current) {
            clearInterval(timeUpdateRef.current);
          }
          timeUpdateRef.current = setInterval(async () => {
            if (playerRef.current) {
              const currentTime = await playerRef.current.getCurrentTime();
              setCurrentTime(currentTime);
            }
          }, 500);
          break;

        case YouTubePlayerState.PAUSED:
          setIsPlaying(false);
          if (timeUpdateRef.current) {
            clearInterval(timeUpdateRef.current);
          }
          break;

        case YouTubePlayerState.ENDED:
          setIsPlaying(false);
          if (timeUpdateRef.current) {
            clearInterval(timeUpdateRef.current);
          }
          playNext();
          break;

        case YouTubePlayerState.BUFFERING:
          setIsLoading(true);
          break;

        case YouTubePlayerState.CUED:
          setIsLoading(false);
          if (playerRef.current) {
            const duration = await playerRef.current.getDuration();
            if (duration) {
              setDuration(duration);
            }
          }
          break;
      }
    },
    [setIsPlaying, setCurrentTime, setIsLoading, playNext, setDuration]
  );

  // Handle errors
  const onError = useCallback(
    (event: YouTubeEvent) => {
      console.error('YouTube Player Error:', event.data);
      setIsLoading(false);
      // Try to play next track on error
      playNext();
    },
    [setIsLoading, playNext]
  );

  // Sync play/pause state
  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
    };
  }, []);

  // Expose seek function
  useEffect(() => {
    const handleSeek = (e: CustomEvent<{ time: number }>) => {
      if (playerRef.current) {
        playerRef.current.seekTo(e.detail.time, true);
        setCurrentTime(e.detail.time);
      }
    };

    window.addEventListener('youamp:seek', handleSeek as EventListener);
    return () => {
      window.removeEventListener('youamp:seek', handleSeek as EventListener);
    };
  }, [setCurrentTime]);

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={className} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
      <YouTube
        videoId={currentTrack.youtubeId}
        opts={{
          height: '1',
          width: '1',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  );
}

// Helper function to seek (called from other components)
export function seekTo(time: number) {
  window.dispatchEvent(
    new CustomEvent('youamp:seek', { detail: { time } })
  );
}
