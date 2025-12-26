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
    addTracksToPlaylist,
  } = usePlaylistStore();
  const { queue, addMultipleToQueue, clearQueue, playTrack } = usePlayerStore();

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

  const handleSaveCurrentQueue = () => {
    if (queue.length === 0) {
      showToast.error('No tracks in queue to save');
      return;
    }
    const name = newPlaylistName.trim() || `Playlist ${new Date().toLocaleDateString()}`;
    const playlist = createPlaylist(name);
    addTracksToPlaylist(playlist.id, queue);
    showToast.playlistCreated(playlist.name);
    setNewPlaylistName('');
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

  const handleAddToQueue = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.tracks.length > 0) {
      addMultipleToQueue(playlist.tracks);
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
      title="YOUAMP PLAYLIST MANAGER"
      position={playlistManagerWindow.position}
      onPositionChange={(pos) => setWindowPosition('playlistManagerWindow', pos)}
      onClose={() => toggleWindow('playlistManagerWindow')}
      width={300}
    >
      <div className="playlist-manager-content">
        {/* Create new playlist */}
        <div className="flex gap-1 mb-1">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            placeholder="NEW PLAYLIST NAME..."
            className="flex-1 text-[9px] px-2 py-1 font-mono uppercase"
            style={{
              background: '#000',
              color: '#00ff00',
              border: '2px solid',
              borderColor: '#0a0a0a #3a3a3a #3a3a3a #0a0a0a',
            }}
          />
          <button
            onClick={handleCreatePlaylist}
            disabled={!newPlaylistName.trim()}
            className="playlist-control-btn"
            style={{ padding: '2px 6px' }}
            title="Create empty playlist"
          >
            +NEW
          </button>
        </div>

        {/* Save current queue */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={handleSaveCurrentQueue}
            disabled={queue.length === 0}
            className="playlist-control-btn flex-1 text-[8px]"
            style={{ background: '#003300' }}
            title="Save current queue as playlist"
          >
            💾 SAVE CURRENT QUEUE ({queue.length} tracks)
          </button>
        </div>

        {/* Playlists list */}
        <div 
          className="max-h-[250px] overflow-y-auto scrollbar-thin"
          style={{
            background: '#000',
            border: '2px solid',
            borderColor: '#0a0a0a #3a3a3a #3a3a3a #0a0a0a',
          }}
        >
          {playlists.length === 0 ? (
            <div className="text-center py-4 text-[#006600] text-[9px] font-mono uppercase">
              *** NO SAVED PLAYLISTS ***
            </div>
          ) : (
            playlists.map((playlist, index) => (
              <div
                key={playlist.id}
                className={cn(
                  'flex items-center gap-1 px-1 py-1 group cursor-pointer',
                  activePlaylistId === playlist.id ? 'bg-[#0000aa] text-white' : 'hover:bg-[#000066]'
                )}
              >
                {/* Number */}
                <span className="text-[9px] font-mono text-[#00ff00] w-4 text-right">
                  {index + 1}.
                </span>

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
                      className="w-full bg-black text-[#00ff00] text-[9px] px-1 py-0.5 font-mono uppercase"
                      style={{
                        border: '1px solid #00ff00',
                      }}
                    />
                  ) : (
                    <div 
                      className="text-[9px] font-mono text-[#00ff00] truncate uppercase"
                      onDoubleClick={() => handleStartRename(playlist.id, playlist.name)}
                      style={{ textShadow: '0 0 4px #00ff00' }}
                    >
                      {playlist.name}
                    </div>
                  )}
                  <div className="text-[8px] font-mono text-[#00aa00]">
                    {playlist.tracks.length} TRACKS • {formatDuration(getTotalDuration(playlist.id))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-px opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleLoadPlaylist(playlist.id)}
                    className="playlist-control-btn"
                    style={{ padding: '1px 4px', fontSize: '8px' }}
                    title="Replace queue with playlist"
                  >
                    LOAD
                  </button>
                  <button
                    onClick={() => handleAddToQueue(playlist.id)}
                    className="playlist-control-btn"
                    style={{ padding: '1px 4px', fontSize: '8px' }}
                    title="Add to current queue"
                  >
                    +ADD
                  </button>
                  <button
                    onClick={() => handleDelete(playlist.id, playlist.name)}
                    className="playlist-control-btn"
                    style={{ padding: '1px 4px', fontSize: '8px', color: '#ff4444' }}
                    title="Delete"
                  >
                    DEL
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
