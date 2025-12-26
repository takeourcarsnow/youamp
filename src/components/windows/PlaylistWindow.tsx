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
        'playlist-track flex items-center gap-2 px-2 py-1 cursor-grab',
        'hover:bg-[#00ff00]/10 transition-colors',
        isCurrentTrack && 'bg-[#00ff00]/20 text-[#00ff00]',
        isSelected && 'bg-[#00ff00]/15',
        isDragging && 'cursor-grabbing'
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
          onRemove();
        }}
        className="text-gray-500 hover:text-[#ff0000] text-xs px-1"
        title="Remove"
      >
        ×
      </button>
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="text-[#00ff00] hover:text-[#00ff00]/80 px-2 py-0.5"
              disabled={queue.length === 0}
              title="Save as playlist"
            >
              💾
            </button>
            <button
              onClick={handleClearQueue}
              className="text-[#ff6666] hover:text-[#ff0000] px-2 py-0.5"
              disabled={queue.length === 0}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Save dialog */}
        {showSaveDialog && (
          <div className="mb-2 p-2 bg-black/30 rounded">
            <div className="text-xs text-[#00ff00] mb-1">Save as playlist:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveToPlaylist()}
                placeholder="Playlist name..."
                className="flex-1 bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30 placeholder:text-[#00ff00]/50"
                autoFocus
              />
              <button
                onClick={handleSaveToPlaylist}
                disabled={!newPlaylistName.trim()}
                className="px-2 py-1 text-xs bg-[#00ff00]/20 hover:bg-[#00ff00]/30 text-[#00ff00] rounded disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Track list */}
        <div className="playlist-tracks max-h-[200px] overflow-y-auto scrollbar-thin">
          {queue.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tracks in playlist
              <br />
              <span className="text-xs">Add tracks from the browser</span>
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
                handleRemoveTrack(queue[selectedIndex]);
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
