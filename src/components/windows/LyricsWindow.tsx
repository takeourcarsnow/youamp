// Lyrics Window - fetch and display lyrics

'use client';

import React, { useState, useEffect } from 'react';
import { WinampWindow } from '@/components/ui';
import { useUIStore, usePlayerStore } from '@/store';
import { showToast } from '@/components/providers/ToastProvider';

// Fetch lyrics from lyrics.ovh API
async function fetchLyrics(artist: string, title: string): Promise<string | null> {
  try {
    // Clean up title (remove featured artists, parentheses, etc.)
    const cleanTitle = title
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/\s*\[.*?\]\s*/g, '')
      .replace(/\s*ft\.?\s*.*/i, '')
      .replace(/\s*feat\.?\s*.*/i, '')
      .trim();
    
    const cleanArtist = artist
      .replace(/\s*ft\.?\s*.*/i, '')
      .replace(/\s*feat\.?\s*.*/i, '')
      .replace(/VEVO$/i, '')
      .trim();

    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.lyrics || null;
  } catch (error) {
    console.error('Lyrics fetch error:', error);
    return null;
  }
}

export function LyricsWindow() {
  const { lyricsWindow, setWindowPosition, toggleWindow } = useUIStore();
  const { currentTrack } = usePlayerStore();
  
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedTrack, setLastFetchedTrack] = useState<string | null>(null);

  useEffect(() => {
    if (!currentTrack || !lyricsWindow.isOpen) {
      return;
    }

    const trackId = currentTrack.id;
    if (trackId === lastFetchedTrack) {
      return;
    }

    setIsLoading(true);
    setLyrics(null);
    setLastFetchedTrack(trackId);

    fetchLyrics(currentTrack.artist, currentTrack.title)
      .then((result) => {
        setLyrics(result);
        if (!result) {
          showToast.lyricsNotFound();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentTrack, lyricsWindow.isOpen, lastFetchedTrack]);

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
            <div className="animate-pulse">*** LOADING LYRICS ***</div>
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
          </div>
        )}
      </div>
    </WinampWindow>
  );
}
