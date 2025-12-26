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
        'mini-player fixed z-[100] overflow-hidden',
        theme === 'light' && 'light-theme'
      )}
      style={{
        left: position.x,
        top: position.y,
        background: '#232323',
        border: '2px solid',
        borderColor: '#4a4a4a #0a0a0a #0a0a0a #4a4a4a',
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
        width: 280,
      }}
    >
      {/* Title bar - Classic Winamp style */}
      <div
        className="flex items-center justify-between px-1 py-0.5 cursor-move select-none"
        style={{
          background: 'linear-gradient(180deg, #4a6a4a 0%, #2a4a2a 30%, #1a3a1a 70%, #0a2a0a 100%)',
          borderBottom: '1px solid #000',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1">
          <div className="flex gap-px">
            <div className="w-[2px] h-[7px] bg-gradient-to-b from-[#7a9a7a] to-[#2a4a2a]" />
            <div className="w-[2px] h-[7px] bg-gradient-to-b from-[#7a9a7a] to-[#2a4a2a]" />
          </div>
          <span className="text-[8px] text-white font-bold ml-0.5" style={{ textShadow: '1px 1px 0 #000' }}>
            YOUAMP MINI
          </span>
        </div>
        <button
          onClick={toggleMiniPlayer}
          className="winamp-button w-[9px] h-[9px]"
          title="Expand to full mode"
        >
          <span className="text-[6px] leading-none">□</span>
        </button>
      </div>

      {/* Progress bar */}
      <div 
        className="h-[3px]" 
        style={{ 
          background: '#000',
          borderBottom: '1px solid #3a3a3a'
        }}
      >
        <div 
          className="h-full"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #006600 0%, #00aa00 50%, #00ff00 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-1 p-1" style={{ background: '#232323' }}>
        {/* Track info */}
        <div className="flex-1 min-w-0 px-1">
          {currentTrack ? (
            <MarqueeText 
              text={`${currentTrack.artist} - ${currentTrack.title}`.toUpperCase()}
              className="text-[9px] text-[#00ff00] font-mono font-bold"
              style={{ textShadow: '0 0 4px #00ff00' }}
              speed={100}
              maxLength={30}
            />
          ) : (
            <div className="text-[9px] text-[#006600] font-mono">*** STOPPED ***</div>
          )}
        </div>

        {/* Controls */}
        <TransportControls compact />
      </div>
    </div>
  );
}
