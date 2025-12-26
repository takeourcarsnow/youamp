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
      title="MEDIA LIBRARY"
      position={browserWindow.position}
      onPositionChange={(pos) => setWindowPosition('browserWindow', pos)}
      onClose={() => toggleWindow('browserWindow')}
      width={320}
    >
      <div className="browser-content">
        {/* Tabs - Classic Winamp style */}
        <div className="flex border-b border-[#3a3a3a] mb-1">
          {(['all', 'genre', 'artist', 'search', 'youtube'] as BrowserTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-2 py-0.5 text-[8px] uppercase font-bold transition-none',
                activeTab === tab
                  ? 'text-[#00ff00] bg-[#1a1a1a] border-t border-l border-r border-[#3a3a3a]'
                  : 'text-[#666] hover:text-[#00aa00]'
              )}
              style={{
                marginBottom: activeTab === tab ? '-1px' : 0,
              }}
            >
              {tab === 'youtube' ? 'YT' : tab}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        {activeTab !== 'youtube' && (
          <div className="flex gap-px mb-1">
            <button
              onClick={handlePlayRandom}
              className="playlist-control-btn flex-1 text-[8px]"
            >
              🎲 RND 10
            </button>
            <button
              onClick={handleShuffleAll}
              className="playlist-control-btn flex-1 text-[8px]"
            >
              🔀 SHUFFLE
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="mb-1">
          {/* Genre selector */}
          {activeTab === 'genre' && (
            <div className="flex flex-wrap gap-px mb-1">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={cn(
                    'px-1.5 py-0.5 text-[7px] uppercase font-bold transition-none',
                    selectedGenre === genre
                      ? 'bg-[#00ff00] text-black'
                      : 'bg-[#2a2a2a] text-[#00aa00] hover:bg-[#3a3a3a]'
                  )}
                  style={{
                    border: '1px solid',
                    borderColor: selectedGenre === genre 
                      ? '#00ff00 #003300 #003300 #00ff00'
                      : '#4a4a4a #1a1a1a #1a1a1a #4a4a4a',
                  }}
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
              className="winamp-select w-full text-[9px] mb-1"
            >
              <option value="">Select artist...</option>
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
              className="winamp-input w-full text-[9px] mb-1"
            />
          )}

          {/* YouTube search */}
          {activeTab === 'youtube' && (
            <div className="flex gap-1 mb-1">
              <input
                type="text"
                value={youtubeQuery}
                onChange={(e) => setYoutubeQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSearch()}
                placeholder="Search YouTube..."
                className="winamp-input flex-1 text-[9px]"
              />
              <button
                onClick={handleYouTubeSearch}
                disabled={isSearching || !youtubeQuery.trim()}
                className="playlist-control-btn text-[8px] px-2"
                style={{ background: '#990000', borderColor: '#cc0000 #660000 #660000 #cc0000' }}
              >
                {isSearching ? '...' : '🔍'}
              </button>
            </div>
          )}
        </div>

        {/* Results header */}
        {displayedTracks.length > 0 && (
          <div className="flex items-center justify-between mb-0.5 px-1">
            <span className="text-[7px] text-[#666] font-mono">
              {displayedTracks.length} TRACK{displayedTracks.length !== 1 ? 'S' : ''}
            </span>
            <button
              onClick={handleAddAll}
              className="text-[7px] text-[#00aa00] hover:text-[#00ff00] font-bold"
            >
              +ADD ALL
            </button>
          </div>
        )}

        {/* Track list */}
        <div 
          className="browser-tracks max-h-[200px] overflow-y-auto scrollbar-thin"
          style={{
            background: '#000',
            border: '2px solid',
            borderColor: '#0a0a0a #3a3a3a #3a3a3a #0a0a0a',
          }}
        >
          {displayedTracks.length === 0 ? (
            <div className="text-center py-4 text-[#006600] text-[9px] font-mono">
              {activeTab === 'youtube' && !youtubeResults.length
                ? isSearching ? 'Searching...' : 'Search YouTube'
                : activeTab === 'search' && !debouncedSearch.trim()
                ? 'Enter search term'
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
                    'browser-track flex items-center gap-1 px-1 py-0.5',
                    'hover:bg-[#00ff00]/5 transition-none group cursor-pointer'
                  )}
                  onDoubleClick={() => handlePlayTrack(track)}
                  onContextMenu={(e) => openContextMenu(e, getTrackContextMenuItems(track))}
                >
                  {/* Track info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-[#00aa00] truncate font-mono">
                      {track.artist} - {track.title}
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-[8px] text-[#006600] font-mono">
                    {track.duration > 0 ? formatDuration(track.duration) : '--:--'}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-px opacity-0 group-hover:opacity-100 transition-none">
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlayTrack(track); }}
                      className="p-0.5 text-[#00ff00] hover:bg-[#00ff00]/10 text-[10px]"
                      title="Play"
                    >
                      ▶
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddTrack(track); }}
                      className={cn(
                        'p-0.5 text-[10px]',
                        isInQueue
                          ? 'text-[#333] cursor-not-allowed'
                          : 'text-[#00ff00] hover:bg-[#00ff00]/10'
                      )}
                      title={isInQueue ? 'In playlist' : 'Add'}
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
