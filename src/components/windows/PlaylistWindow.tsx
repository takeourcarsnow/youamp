// Playlist Window

'use client';

import React, { useState } from 'react';
import { WinampWindow } from '@/components/ui';
import { useUIStore, usePlayerStore } from '@/store';
import { Track } from '@/types';
import { formatDuration, cn } from '@/lib/utils';

export function PlaylistWindow() {
  const { playlistWindow, setWindowPosition, toggleWindow } = useUIStore();
  const {
    queue,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue,
    reorderQueue,
  } = usePlayerStore();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!playlistWindow.isOpen) return null;

  const handleTrackClick = (track: Track, index: number) => {
    setSelectedIndex(index);
  };

  const handleTrackDoubleClick = (track: Track) => {
    playTrack(track);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderQueue(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalDuration = queue.reduce((sum, track) => sum + track.duration, 0);

  return (
    <WinampWindow
      title={`Playlist (${queue.length} tracks)`}
      position={playlistWindow.position}
      onPositionChange={(pos) => setWindowPosition('playlistWindow', pos)}
      onClose={() => toggleWindow('playlistWindow')}
      width={275}
    >
      <div className="playlist-content">
        {/* Playlist header */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-[#00ff00]">
            {queue.length} track{queue.length !== 1 ? 's' : ''} •{' '}
            {formatDuration(totalDuration)}
          </span>
          <button
            onClick={clearQueue}
            className="text-[#ff6666] hover:text-[#ff0000] px-2 py-0.5"
            disabled={queue.length === 0}
          >
            Clear
          </button>
        </div>

        {/* Track list */}
        <div className="playlist-tracks max-h-[200px] overflow-y-auto scrollbar-thin">
          {queue.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tracks in playlist
              <br />
              <span className="text-xs">Add tracks from the browser</span>
            </div>
          ) : (
            queue.map((track, index) => (
              <div
                key={track.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => handleTrackClick(track, index)}
                onDoubleClick={() => handleTrackDoubleClick(track)}
                className={cn(
                  'playlist-track flex items-center gap-2 px-2 py-1 cursor-pointer',
                  'hover:bg-[#00ff00]/10 transition-colors',
                  currentTrack?.id === track.id && 'bg-[#00ff00]/20 text-[#00ff00]',
                  selectedIndex === index && 'bg-[#00ff00]/15',
                  draggedIndex === index && 'opacity-50'
                )}
              >
                {/* Track number */}
                <span className="text-[10px] text-gray-500 w-5 text-right">
                  {index + 1}.
                </span>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">
                    {track.artist} - {track.title}
                  </div>
                </div>

                {/* Duration */}
                <span className="text-[10px] text-gray-400">
                  {formatDuration(track.duration)}
                </span>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(track.id);
                  }}
                  className="text-gray-500 hover:text-[#ff0000] text-xs px-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Playlist controls */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#00ff00]/20">
          <button
            onClick={() => {
              if (selectedIndex !== null && selectedIndex > 0) {
                reorderQueue(selectedIndex, selectedIndex - 1);
                setSelectedIndex(selectedIndex - 1);
              }
            }}
            disabled={selectedIndex === null || selectedIndex === 0}
            className="playlist-control-btn"
            title="Move Up"
          >
            ↑
          </button>
          <button
            onClick={() => {
              if (selectedIndex !== null && selectedIndex < queue.length - 1) {
                reorderQueue(selectedIndex, selectedIndex + 1);
                setSelectedIndex(selectedIndex + 1);
              }
            }}
            disabled={selectedIndex === null || selectedIndex === queue.length - 1}
            className="playlist-control-btn"
            title="Move Down"
          >
            ↓
          </button>
          <button
            onClick={() => {
              if (selectedIndex !== null) {
                removeFromQueue(queue[selectedIndex].id);
                setSelectedIndex(null);
              }
            }}
            disabled={selectedIndex === null}
            className="playlist-control-btn text-[#ff6666] hover:text-[#ff0000]"
            title="Remove Selected"
          >
            Del
          </button>
        </div>
      </div>
    </WinampWindow>
  );
}
