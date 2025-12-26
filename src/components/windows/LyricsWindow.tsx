// Lyrics Window - fetch and display lyrics

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WinampWindow } from '@/components/ui';
import { useUIStore, usePlayerStore } from '@/store';
import { showToast } from '@/components/providers/ToastProvider';

// Clean up title/artist for better API matching
function cleanForSearch(text: string): string {
  return text
    // Remove common video suffixes
    .replace(/\s*\(Official\s*(Music\s*)?Video\)/gi, '')
    .replace(/\s*\(Official\s*Audio\)/gi, '')
    .replace(/\s*\(Lyric\s*Video\)/gi, '')
    .replace(/\s*\(Lyrics?\)/gi, '')
    .replace(/\s*\(Audio\)/gi, '')
    .replace(/\s*\[Official\s*(Music\s*)?Video\]/gi, '')
    .replace(/\s*\[Official\s*Audio\]/gi, '')
    .replace(/\s*\[Lyric\s*Video\]/gi, '')
    .replace(/\s*\[Lyrics?\]/gi, '')
    .replace(/\s*\[Audio\]/gi, '')
    // Remove featuring info
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\[.*?\]\s*/g, '')
    .replace(/\s*ft\.?\s*.*/i, '')
    .replace(/\s*feat\.?\s*.*/i, '')
    .replace(/\s*featuring\s*.*/i, '')
    // Remove channel suffixes
    .replace(/VEVO$/i, '')
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/Official$/i, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract artist and title from YouTube-style titles
function parseYouTubeTitle(title: string, channelName: string): { artist: string; title: string } {
  const cleaned = cleanForSearch(title);
  
  // Check for "Artist - Title" format
  const dashMatch = cleaned.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    return {
      artist: cleanForSearch(dashMatch[1]),
      title: cleanForSearch(dashMatch[2]),
    };
  }
  
  // Check for "Title by Artist" format
  const byMatch = cleaned.match(/^(.+?)\s+by\s+(.+)$/i);
  if (byMatch) {
    return {
      artist: cleanForSearch(byMatch[2]),
      title: cleanForSearch(byMatch[1]),
    };
  }
  
  // Fall back to channel name as artist
  return {
    artist: cleanForSearch(channelName),
    title: cleaned,
  };
}

// Try LRCLIB API (has synced lyrics)
async function fetchFromLrclib(artist: string, title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    // Prefer plain lyrics, fall back to synced
    return data.plainLyrics || data.syncedLyrics?.replace(/\[\d+:\d+\.\d+\]/g, '').trim() || null;
  } catch {
    return null;
  }
}

// Try lyrics.ovh API
async function fetchFromLyricsOvh(artist: string, title: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.lyrics || null;
  } catch {
    return null;
  }
}

// Search LRCLIB by query (fallback when exact match fails)
async function searchLrclib(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const first = data[0];
      return first.plainLyrics || first.syncedLyrics?.replace(/\[\d+:\d+\.\d+\]/g, '').trim() || null;
    }
    return null;
  } catch {
    return null;
  }
}

// Main fetch function with multiple fallbacks
async function fetchLyrics(artist: string, title: string): Promise<string | null> {
  const parsed = parseYouTubeTitle(title, artist);
  const cleanArtist = parsed.artist;
  const cleanTitle = parsed.title;
  
  console.log(`Searching lyrics for: "${cleanArtist}" - "${cleanTitle}"`);
  
  // Try LRCLIB first (most reliable)
  let lyrics = await fetchFromLrclib(cleanArtist, cleanTitle);
  if (lyrics) {
    console.log('Found lyrics via LRCLIB');
    return lyrics;
  }
  
  // Try lyrics.ovh
  lyrics = await fetchFromLyricsOvh(cleanArtist, cleanTitle);
  if (lyrics) {
    console.log('Found lyrics via lyrics.ovh');
    return lyrics;
  }
  
  // Try LRCLIB search with combined query
  lyrics = await searchLrclib(`${cleanArtist} ${cleanTitle}`);
  if (lyrics) {
    console.log('Found lyrics via LRCLIB search');
    return lyrics;
  }
  
  // Last resort: try with original title only
  lyrics = await searchLrclib(title);
  if (lyrics) {
    console.log('Found lyrics via LRCLIB title search');
    return lyrics;
  }
  
  return null;
}

export function LyricsWindow() {
  const { lyricsWindow, setWindowPosition, toggleWindow } = useUIStore();
  const { currentTrack } = usePlayerStore();
  
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedTrack, setLastFetchedTrack] = useState<string | null>(null);

  const loadLyrics = useCallback(async () => {
    if (!currentTrack) return;
    
    setIsLoading(true);
    setLyrics(null);
    setLastFetchedTrack(currentTrack.id);

    const result = await fetchLyrics(currentTrack.artist, currentTrack.title);
    setLyrics(result);
    if (!result) {
      showToast.lyricsNotFound();
    }
    setIsLoading(false);
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack || !lyricsWindow.isOpen) {
      return;
    }

    const trackId = currentTrack.id;
    if (trackId === lastFetchedTrack) {
      return;
    }

    loadLyrics();
  }, [currentTrack, lyricsWindow.isOpen, lastFetchedTrack, loadLyrics]);

  if (!lyricsWindow.isOpen) return null;

  return (
    <WinampWindow
      title="YOUAMP LYRICS"
      position={lyricsWindow.position}
      onPositionChange={(pos) => setWindowPosition('lyricsWindow', pos)}
      onClose={() => toggleWindow('lyricsWindow')}
      width={300}
    >
      <div 
        className="lyrics-content max-h-[400px] overflow-y-auto scrollbar-thin"
        style={{
          background: '#000',
          border: '2px solid',
          borderColor: '#0a0a0a #3a3a3a #3a3a3a #0a0a0a',
          padding: '4px',
        }}
      >
        {!currentTrack ? (
          <div className="text-center py-8 text-[#006600] text-[10px] font-mono uppercase">
            *** NO TRACK PLAYING ***
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-[#00ff00] text-[10px] font-mono uppercase">
            <div className="animate-pulse">*** SEARCHING LYRICS ***</div>
          </div>
        ) : lyrics ? (
          <div 
            className="text-[10px] text-[#00ff00] whitespace-pre-line leading-relaxed p-1 font-mono"
            style={{ textShadow: '0 0 4px #00ff00' }}
          >
            {lyrics}
          </div>
        ) : (
          <div className="text-center py-8 text-[#006600] text-[10px] font-mono uppercase">
            <p>*** LYRICS NOT FOUND ***</p>
            <p className="mt-2 text-[#00aa00]">
              {currentTrack.artist} - {currentTrack.title}
            </p>
            <button
              onClick={loadLyrics}
              className="mt-3 px-3 py-1 text-[9px] bg-[#1a1a1a] text-[#00ff00] hover:bg-[#2a2a2a]"
              style={{
                border: '1px solid',
                borderColor: '#4a4a4a #1a1a1a #1a1a1a #4a4a4a',
              }}
            >
              🔄 RETRY
            </button>
          </div>
        )}
      </div>
    </WinampWindow>
  );
}
