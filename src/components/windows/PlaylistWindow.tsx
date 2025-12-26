// Playlist Window

'use client';

import React, { useState } from 'react';
import { WinampWindow, ContextMenu, useContextMenu } from '@/components/ui';
import { useUIStore, usePlayerStore, usePlaylistStore } from '@/store';
import { showToast } from '@/components/providers';
import { Track } from '@/types';
import { formatDuration, cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTrackItemProps {
  track: Track;
  index: number;
  isCurrentTrack: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onRemove: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function SortableTrackItem({
  track,
  index,
  isCurrentTrack,
  isSelected,
  onSelect,
  onDoubleClick,
  onRemove,
  onContextMenu,
}: SortableTrackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={cn(
        'playlist-track flex items-center gap-1 px-1 py-0.5 cursor-grab select-none',
        'hover:bg-[#00ff00]/5 transition-none',
        isCurrentTrack && 'bg-[#00ff00]/10 text-[#00ff00]',
        isSelected && !isCurrentTrack && 'bg-[#00ff00]/5',
        isDragging && 'cursor-grabbing'
      )}
    >
      {/* Track number */}
      <span className="text-[9px] text-[#00aa00] w-4 text-right font-mono">
        {index + 1}.
      </span>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-[9px] truncate font-mono",
          isCurrentTrack ? "text-[#00ff00]" : "text-[#00aa00]"
        )}>
          {track.artist} - {track.title}
        </div>
      </div>

      {/* Duration */}
      <span className="text-[9px] text-[#008800] font-mono">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}

export function PlaylistWindow() {
  const { playlistWindow, setWindowPosition, toggleWindow } = useUIStore();
  const {
    queue,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    addToQueueNext,
  } = usePlayerStore();
  const { playlists, createPlaylist, addTracksToPlaylist } = usePlaylistStore();
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!playlistWindow.isOpen) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = queue.findIndex((t) => t.id === active.id);
      const newIndex = queue.findIndex((t) => t.id === over.id);
      reorderQueue(oldIndex, newIndex);
    }
  };

  const handleTrackDoubleClick = (track: Track) => {
    playTrack(track);
  };

  const handleRemoveTrack = (track: Track) => {
    removeFromQueue(track.id);
    showToast.trackRemoved(track.title);
  };

  const handleClearQueue = () => {
    clearQueue();
    showToast.playlistCleared();
  };

  const handleSaveToPlaylist = () => {
    if (newPlaylistName.trim() && queue.length > 0) {
      const playlist = createPlaylist(newPlaylistName.trim());
      addTracksToPlaylist(playlist.id, queue);
      showToast.playlistCreated(playlist.name);
      setNewPlaylistName('');
      setShowSaveDialog(false);
    }
  };

  const getTrackContextMenuItems = (track: Track, index: number) => [
    { label: 'Play', icon: '▶', onClick: () => playTrack(track) },
    { label: 'Play Next', icon: '⏭', onClick: () => {
      removeFromQueue(track.id);
      addToQueueNext(track);
    }},
    { divider: true, label: '', onClick: () => {} },
    { label: 'Move to Top', icon: '⬆', onClick: () => reorderQueue(index, 0), disabled: index === 0 },
    { label: 'Move to Bottom', icon: '⬇', onClick: () => reorderQueue(index, queue.length - 1), disabled: index === queue.length - 1 },
    { divider: true, label: '', onClick: () => {} },
    { 
      label: 'Copy YouTube Link', 
      icon: '🔗', 
      onClick: () => {
        navigator.clipboard.writeText(`https://youtube.com/watch?v=${track.youtubeId}`);
        showToast.copiedToClipboard();
      }
    },
    { divider: true, label: '', onClick: () => {} },
    { label: 'Remove', icon: '🗑️', onClick: () => handleRemoveTrack(track), danger: true },
  ];

  const totalDuration = queue.reduce((sum, track) => sum + track.duration, 0);

  return (
    <WinampWindow
      title="PLAYLIST"
      position={playlistWindow.position}
      onPositionChange={(pos) => setWindowPosition('playlistWindow', pos)}
      onClose={() => toggleWindow('playlistWindow')}
      width={275}
    >
      <div className="playlist-content">
        {/* Track list area with classic inset border */}
        <div 
          className="mb-1"
          style={{
            background: '#000',
            border: '2px solid',
            borderColor: '#0a0a0a #3a3a3a #3a3a3a #0a0a0a',
          }}
        >
          <div className="playlist-tracks max-h-[180px] overflow-y-auto scrollbar-thin">
            {queue.length === 0 ? (
              <div className="text-center py-6 text-[#006600] text-[9px] font-mono">
                No tracks in playlist
                <br />
                <span className="text-[8px]">Add tracks from the browser</span>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={queue.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {queue.map((track, index) => (
                    <SortableTrackItem
                      key={track.id}
                      track={track}
                      index={index}
                      isCurrentTrack={currentTrack?.id === track.id}
                      isSelected={selectedIndex === index}
                      onSelect={() => setSelectedIndex(index)}
                      onDoubleClick={() => handleTrackDoubleClick(track)}
                      onRemove={() => handleRemoveTrack(track)}
                      onContextMenu={(e) => openContextMenu(e, getTrackContextMenuItems(track, index))}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-1 py-0.5 border-t border-[#3a3a3a]">
          <span className="text-[8px] text-[#00aa00] font-mono">
            {queue.length} track{queue.length !== 1 ? 's' : ''} / {formatDuration(totalDuration)}
          </span>
        </div>

        {/* Save dialog */}
        {showSaveDialog && (
          <div className="mt-1 p-1 border border-[#3a3a3a]" style={{ background: '#1a1a1a' }}>
            <div className="text-[8px] text-[#00ff00] mb-1 font-mono">SAVE AS:</div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveToPlaylist()}
                placeholder="Playlist name..."
                className="winamp-input flex-1 text-[9px]"
                autoFocus
              />
              <button
                onClick={handleSaveToPlaylist}
                disabled={!newPlaylistName.trim()}
                className="playlist-control-btn text-[8px]"
              >
                OK
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="playlist-control-btn text-[8px]"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Playlist controls */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#3a3a3a]">
          <div className="flex gap-px">
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={queue.length === 0}
              className="playlist-control-btn text-[8px]"
              title="Save as playlist"
            >
              +LIST
            </button>
            <button
              onClick={() => {
                if (selectedIndex !== null) {
                  handleRemoveTrack(queue[selectedIndex]);
                  setSelectedIndex(null);
                }
              }}
              disabled={selectedIndex === null}
              className="playlist-control-btn text-[8px]"
              title="Remove Selected"
            >
              -FILE
            </button>
          </div>
          
          <div className="flex gap-px">
            <button
              onClick={() => {
                if (selectedIndex !== null && selectedIndex > 0) {
                  reorderQueue(selectedIndex, selectedIndex - 1);
                  setSelectedIndex(selectedIndex - 1);
                }
              }}
              disabled={selectedIndex === null || selectedIndex === 0}
              className="playlist-control-btn text-[8px]"
              title="Move Up"
            >
              ▲
            </button>
            <button
              onClick={() => {
                if (selectedIndex !== null && selectedIndex < queue.length - 1) {
                  reorderQueue(selectedIndex, selectedIndex + 1);
                  setSelectedIndex(selectedIndex + 1);
                }
              }}
              disabled={selectedIndex === null || selectedIndex === queue.length - 1}
              className="playlist-control-btn text-[8px]"
              title="Move Down"
            >
              ▼
            </button>
          </div>

          <button
            onClick={handleClearQueue}
            className="playlist-control-btn text-[8px] text-[#ff6666]"
            disabled={queue.length === 0}
            title="Clear playlist"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={contextMenu.items}
          position={contextMenu.position}
          onClose={closeContextMenu}
        />
      )}
    </WinampWindow>
  );
}
