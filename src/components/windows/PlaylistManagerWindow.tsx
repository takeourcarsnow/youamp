// Playlist Manager Window - manage multiple playlists

'use client';

import React, { useState } from 'react';
import { WinampWindow } from '@/components/ui';
import { useUIStore, usePlaylistStore, usePlayerStore } from '@/store';
import { formatDuration, cn } from '@/lib/utils';
import { showToast } from '@/components/providers/ToastProvider';

export function PlaylistManagerWindow() {
  const { playlistManagerWindow, setWindowPosition, toggleWindow } = useUIStore();
  const { 
    playlists, 
    activePlaylistId,
    createPlaylist, 
    deletePlaylist, 
    renamePlaylist,
    setActivePlaylist,
    getTotalDuration,
  } = usePlaylistStore();
  const { addMultipleToQueue, clearQueue, playTrack } = usePlayerStore();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!playlistManagerWindow.isOpen) return null;

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlist = createPlaylist(newPlaylistName.trim());
      showToast.playlistCreated(playlist.name);
      setNewPlaylistName('');
    }
  };

  const handleLoadPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      clearQueue();
      addMultipleToQueue(playlist.tracks);
      if (playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
      setActivePlaylist(playlistId);
      showToast.tracksAdded(playlist.tracks.length);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deletePlaylist(id);
    showToast.playlistDeleted(name);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleFinishRename = () => {
    if (editingId && editingName.trim()) {
      renamePlaylist(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  return (
    <WinampWindow
      title="Playlist Manager"
      position={playlistManagerWindow.position}
      onPositionChange={(pos) => setWindowPosition('playlistManagerWindow', pos)}
      onClose={() => toggleWindow('playlistManagerWindow')}
      width={300}
    >
      <div className="playlist-manager-content">
        {/* Create new playlist */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            placeholder="New playlist name..."
            className="flex-1 bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30 placeholder:text-[#00ff00]/50"
          />
          <button
            onClick={handleCreatePlaylist}
            disabled={!newPlaylistName.trim()}
            className="px-2 py-1 text-xs bg-[#00ff00]/10 hover:bg-[#00ff00]/20 text-[#00ff00] rounded disabled:opacity-50"
          >
            Create
          </button>
        </div>

        {/* Playlists list */}
        <div className="max-h-[250px] overflow-y-auto scrollbar-thin">
          {playlists.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs">
              No saved playlists
            </div>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={cn(
                  'flex items-center gap-2 px-2 py-2 mb-1 rounded',
                  'hover:bg-[#00ff00]/10 transition-colors group',
                  activePlaylistId === playlist.id && 'bg-[#00ff00]/15'
                )}
              >
                {/* Icon */}
                <span className="text-[#00ff00]">📁</span>

                {/* Name / Edit field */}
                <div className="flex-1 min-w-0">
                  {editingId === playlist.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleFinishRename}
                      onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                      autoFocus
                      className="w-full bg-black/50 text-[#00ff00] text-xs px-1 py-0.5 rounded border border-[#00ff00]/50"
                    />
                  ) : (
                    <div 
                      className="text-xs text-[#00ff00] truncate cursor-pointer"
                      onDoubleClick={() => handleStartRename(playlist.id, playlist.name)}
                    >
                      {playlist.name}
                    </div>
                  )}
                  <div className="text-[10px] text-gray-500">
                    {playlist.tracks.length} tracks • {formatDuration(getTotalDuration(playlist.id))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleLoadPlaylist(playlist.id)}
                    className="p-1 text-[#00ff00] hover:bg-[#00ff00]/20 rounded text-xs"
                    title="Load playlist"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => handleStartRename(playlist.id, playlist.name)}
                    className="p-1 text-[#00ff00] hover:bg-[#00ff00]/20 rounded text-xs"
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(playlist.id, playlist.name)}
                    className="p-1 text-[#ff4444] hover:bg-[#ff4444]/20 rounded text-xs"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WinampWindow>
  );
}
