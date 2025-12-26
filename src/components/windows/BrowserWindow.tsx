// Music Browser Window - browse by genre, artist, search, YouTube

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { WinampWindow, ContextMenu, useContextMenu } from '@/components/ui';
import { useUIStore, usePlayerStore, usePlaylistStore } from '@/store';
import { showToast } from '@/components/providers';
import { Track, Genre, GENRES } from '@/types';
import {
  SAMPLE_TRACKS,
  getTracksByGenre,
  getTracksByArtist,
  getAllArtists,
  getRandomTracks,
  searchTracks,
} from '@/lib/data';
import { 
  formatDuration, 
  cn, 
  searchYouTubeInvidious, 
  youtubeResultToTrack, 
  parseYouTubeDuration 
} from '@/lib/utils';
import { useDebounce } from '@/hooks';

type BrowserTab = 'all' | 'genre' | 'artist' | 'search' | 'youtube';

export function BrowserWindow() {
  const { browserWindow, setWindowPosition, toggleWindow } = useUIStore();
  const { addToQueue, addMultipleToQueue, playTrack, queue, addToQueueNext } = usePlayerStore();
  const { playlists, addTrackToPlaylist } = usePlaylistStore();
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  const [activeTab, setActiveTab] = useState<BrowserTab>('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const artists = useMemo(() => getAllArtists(), []);

  const displayedTracks = useMemo(() => {
    switch (activeTab) {
      case 'genre':
        return selectedGenre ? getTracksByGenre(selectedGenre) : [];
      case 'artist':
        return selectedArtist ? getTracksByArtist(selectedArtist) : [];
      case 'search':
        return debouncedSearch.trim() ? searchTracks(debouncedSearch) : [];
      case 'youtube':
        return youtubeResults;
      default:
        return SAMPLE_TRACKS;
    }
  }, [activeTab, selectedGenre, selectedArtist, debouncedSearch, youtubeResults]);

  const handleYouTubeSearch = useCallback(async () => {
    if (!youtubeQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchYouTubeInvidious(youtubeQuery, 15);
      const tracks = results.map(r => 
        youtubeResultToTrack(r, r.duration ? parseYouTubeDuration(r.duration) : 0)
      );
      setYoutubeResults(tracks);
    } catch (error) {
      showToast.error('Search failed. Try again later.');
    } finally {
      setIsSearching(false);
    }
  }, [youtubeQuery]);

  if (!browserWindow.isOpen) return null;

  const handleAddTrack = (track: Track) => {
    addToQueue(track);
    showToast.trackAdded(track.title);
  };

  const handlePlayTrack = (track: Track) => {
    if (!queue.find((t) => t.id === track.id)) {
      addToQueue(track);
    }
    playTrack(track);
  };

  const handleAddAll = () => {
    const tracksToAdd = displayedTracks.filter(
      (t) => !queue.find((q) => q.youtubeId === t.youtubeId)
    );
    addMultipleToQueue(tracksToAdd);
    showToast.tracksAdded(tracksToAdd.length);
  };

  const handlePlayRandom = () => {
    const randomTracks = getRandomTracks(10);
    addMultipleToQueue(randomTracks);
    if (randomTracks.length > 0) {
      playTrack(randomTracks[0]);
    }
    showToast.tracksAdded(randomTracks.length);
  };

  const handleShuffleAll = () => {
    const shuffled = [...SAMPLE_TRACKS].sort(() => Math.random() - 0.5);
    addMultipleToQueue(shuffled);
    if (shuffled.length > 0) {
      playTrack(shuffled[0]);
    }
    showToast.tracksAdded(shuffled.length);
  };

  const getTrackContextMenuItems = (track: Track) => [
    { label: 'Play', icon: '▶', onClick: () => handlePlayTrack(track) },
    { label: 'Play Next', icon: '⏭', onClick: () => {
      addToQueueNext(track);
      showToast.trackAdded(track.title);
    }},
    { label: 'Add to Queue', icon: '+', onClick: () => handleAddTrack(track) },
    { divider: true, label: '', onClick: () => {} },
    ...playlists.map(playlist => ({
      label: `Add to "${playlist.name}"`,
      icon: '📁',
      onClick: () => {
        addTrackToPlaylist(playlist.id, track);
        showToast.trackAdded(track.title);
      },
    })),
    { divider: true, label: '', onClick: () => {} },
    { 
      label: 'Copy YouTube Link', 
      icon: '🔗', 
      onClick: () => {
        navigator.clipboard.writeText(`https://youtube.com/watch?v=${track.youtubeId}`);
        showToast.copiedToClipboard();
      }
    },
  ];

  return (
    <WinampWindow
      title="Music Browser"
      position={browserWindow.position}
      onPositionChange={(pos) => setWindowPosition('browserWindow', pos)}
      onClose={() => toggleWindow('browserWindow')}
      width={350}
    >
      <div className="browser-content">
        {/* Tabs */}
        <div className="flex border-b border-[#00ff00]/30 mb-2">
          {(['all', 'genre', 'artist', 'search', 'youtube'] as BrowserTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1 text-xs capitalize transition-colors',
                activeTab === tab
                  ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
                  : 'text-gray-400 hover:text-[#00ff00]'
              )}
            >
              {tab === 'youtube' ? 'YouTube' : tab}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        {activeTab !== 'youtube' && (
          <div className="flex gap-2 mb-2">
            <button
              onClick={handlePlayRandom}
              className="flex-1 py-1 text-xs bg-[#00ff00]/10 hover:bg-[#00ff00]/20 text-[#00ff00] rounded transition-colors"
            >
              🎲 Random 10
            </button>
            <button
              onClick={handleShuffleAll}
              className="flex-1 py-1 text-xs bg-[#00ff00]/10 hover:bg-[#00ff00]/20 text-[#00ff00] rounded transition-colors"
            >
              🔀 Shuffle All
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="mb-2">
          {/* Genre selector */}
          {activeTab === 'genre' && (
            <div className="flex flex-wrap gap-1 mb-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={cn(
                    'px-2 py-0.5 text-[10px] rounded capitalize transition-colors',
                    selectedGenre === genre
                      ? 'bg-[#00ff00] text-black'
                      : 'bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20'
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {/* Artist selector */}
          {activeTab === 'artist' && (
            <select
              value={selectedArtist || ''}
              onChange={(e) => setSelectedArtist(e.target.value || null)}
              className="w-full bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30 mb-2"
            >
              <option value="">Select an artist...</option>
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          )}

          {/* Search input */}
          {activeTab === 'search' && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              className="w-full bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30 mb-2 placeholder:text-[#00ff00]/50"
            />
          )}

          {/* YouTube search */}
          {activeTab === 'youtube' && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={youtubeQuery}
                onChange={(e) => setYoutubeQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSearch()}
                placeholder="Search YouTube..."
                className="flex-1 bg-black/50 text-[#00ff00] text-xs px-2 py-1 rounded border border-[#00ff00]/30 placeholder:text-[#00ff00]/50"
              />
              <button
                onClick={handleYouTubeSearch}
                disabled={isSearching || !youtubeQuery.trim()}
                className="px-3 py-1 text-xs bg-[#ff0000]/80 hover:bg-[#ff0000] text-white rounded disabled:opacity-50"
              >
                {isSearching ? '...' : '🔍'}
              </button>
            </div>
          )}
        </div>

        {/* Results header */}
        {displayedTracks.length > 0 && (
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400">
              {displayedTracks.length} track{displayedTracks.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleAddAll}
              className="text-[10px] text-[#00ff00] hover:underline"
            >
              + Add All
            </button>
          </div>
        )}

        {/* Track list */}
        <div className="browser-tracks max-h-[250px] overflow-y-auto scrollbar-thin">
          {displayedTracks.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-xs">
              {activeTab === 'youtube' && !youtubeResults.length
                ? isSearching ? 'Searching...' : 'Search YouTube for music'
                : activeTab === 'search' && !debouncedSearch.trim()
                ? 'Enter a search term'
                : activeTab === 'genre' && !selectedGenre
                ? 'Select a genre'
                : activeTab === 'artist' && !selectedArtist
                ? 'Select an artist'
                : 'No tracks found'}
            </div>
          ) : (
            displayedTracks.map((track) => {
              const isInQueue = queue.find((q) => q.youtubeId === track.youtubeId);
              return (
                <div
                  key={track.id}
                  className={cn(
                    'browser-track flex items-center gap-2 px-2 py-1.5',
                    'hover:bg-[#00ff00]/10 transition-colors group'
                  )}
                  onContextMenu={(e) => openContextMenu(e, getTrackContextMenuItems(track))}
                >
                  {/* Thumbnail */}
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-8 h-8 rounded object-cover"
                    loading="lazy"
                  />

                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#00ff00] truncate">
                      {track.title}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {track.artist} {track.genre !== 'other' && `• ${track.genre}`}
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-[10px] text-gray-500">
                    {track.duration > 0 ? formatDuration(track.duration) : '--:--'}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-1 text-[#00ff00] hover:bg-[#00ff00]/20 rounded"
                      title="Play"
                    >
                      ▶
                    </button>
                    <button
                      onClick={() => handleAddTrack(track)}
                      className={cn(
                        'p-1 rounded',
                        isInQueue
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-[#00ff00] hover:bg-[#00ff00]/20'
                      )}
                      title={isInQueue ? 'Already in playlist' : 'Add to playlist'}
                      disabled={!!isInQueue}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })
          )}
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
