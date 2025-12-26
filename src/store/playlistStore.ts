// Playlist store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Playlist, Track } from '@/types';

interface PlaylistStore {
  playlists: Playlist[];
  activePlaylistId: string | null;

  // Playlist CRUD
  createPlaylist: (name: string) => Playlist;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  duplicatePlaylist: (id: string) => Playlist | null;

  // Track management
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  addTracksToPlaylist: (playlistId: string, tracks: Track[]) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  reorderTrackInPlaylist: (
    playlistId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  clearPlaylist: (playlistId: string) => void;

  // Selection
  setActivePlaylist: (id: string | null) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  getActivePlaylist: () => Playlist | undefined;

  // Utilities
  getTotalDuration: (playlistId: string) => number;
  getTrackCount: (playlistId: string) => number;
}

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],
      activePlaylistId: null,

      createPlaylist: (name) => {
        const newPlaylist: Playlist = {
          id: uuidv4(),
          name,
          tracks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));

        return newPlaylist;
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
          activePlaylistId:
            state.activePlaylistId === id ? null : state.activePlaylistId,
        }));
      },

      renamePlaylist: (id, name) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date() } : p
          ),
        }));
      },

      duplicatePlaylist: (id) => {
        const playlist = get().getPlaylistById(id);
        if (!playlist) return null;

        const newPlaylist: Playlist = {
          id: uuidv4(),
          name: `${playlist.name} (Copy)`,
          tracks: [...playlist.tracks],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));

        return newPlaylist;
      },

      addTrackToPlaylist: (playlistId, track) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: [...p.tracks, track],
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      addTracksToPlaylist: (playlistId, tracks) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: [...p.tracks, ...tracks],
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      removeTrackFromPlaylist: (playlistId, trackId) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.filter((t) => t.id !== trackId),
                  updatedAt: new Date(),
                }
              : p
          ),
        }));
      },

      reorderTrackInPlaylist: (playlistId, fromIndex, toIndex) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id !== playlistId) return p;

            const newTracks = [...p.tracks];
            const [removed] = newTracks.splice(fromIndex, 1);
            newTracks.splice(toIndex, 0, removed);

            return {
              ...p,
              tracks: newTracks,
              updatedAt: new Date(),
            };
          }),
        }));
      },

      clearPlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: [], updatedAt: new Date() }
              : p
          ),
        }));
      },

      setActivePlaylist: (id) => {
        set({ activePlaylistId: id });
      },

      getPlaylistById: (id) => {
        return get().playlists.find((p) => p.id === id);
      },

      getActivePlaylist: () => {
        const { playlists, activePlaylistId } = get();
        return playlists.find((p) => p.id === activePlaylistId);
      },

      getTotalDuration: (playlistId) => {
        const playlist = get().getPlaylistById(playlistId);
        if (!playlist) return 0;
        return playlist.tracks.reduce((total, track) => total + track.duration, 0);
      },

      getTrackCount: (playlistId) => {
        const playlist = get().getPlaylistById(playlistId);
        return playlist?.tracks.length ?? 0;
      },
    }),
    {
      name: 'youamp-playlist-storage',
    }
  )
);
