// Mini Player Window - compact mode

'use client';

import React from 'react';
import { useUIStore, usePlayerStore } from '@/store';
import { useDraggable } from '@/hooks';
import { TransportControls, VolumeControl } from '@/components/player';
import { MarqueeText } from '@/components/ui';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const { miniPlayerMode, miniPlayerPosition, setMiniPlayerPosition, toggleMiniPlayer, theme } = useUIStore();
  const { currentTrack, isPlaying, currentTime, duration } = usePlayerStore();
  
  const { position, handleMouseDown } = useDraggable({
    initialPosition: miniPlayerPosition,
    onPositionChange: setMiniPlayerPosition,
  });

  if (!miniPlayerMode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'mini-player fixed z-[100] rounded-sm overflow-hidden',
        theme === 'light' && 'light-theme'
      )}
      style={{
        left: position.x,
        top: position.y,
        background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)',
        border: '1px solid #3a3a5a',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 0, 0.1)',
        width: 320,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-2 py-1 cursor-move select-none"
        style={{
          background: 'linear-gradient(180deg, #3a3a5a 0%, #2a2a40 100%)',
          borderBottom: '1px solid #1a1a2e',
        }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-[10px] text-[#00ff00] font-bold">YouAmp Mini</span>
        <button
          onClick={toggleMiniPlayer}
          className="text-[#00ff00] hover:text-white text-xs px-1"
          title="Expand to full mode"
        >
          ⬜
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-black/50">
        <div 
          className="h-full bg-gradient-to-r from-[#00aa00] to-[#00ff00]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-2 p-2">
        {/* Thumbnail */}
        {currentTrack && (
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="w-10 h-10 rounded object-cover"
          />
        )}

        {/* Track info */}
        <div className="flex-1 min-w-0">
          {currentTrack ? (
            <>
              <MarqueeText 
                text={currentTrack.title}
                className="text-xs text-[#00ff00]"
                speed={30}
              />
              <div className="text-[10px] text-[#00aa00] truncate">
                {currentTrack.artist}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-500">No track playing</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <TransportControls compact />
        </div>
      </div>
    </div>
  );
}
