// YouTube utilities

import { v4 as uuidv4 } from 'uuid';
import { Track, Genre, YouTubeSearchResult } from '@/types';

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'
): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Create a track from YouTube search result
 */
export function createTrackFromYouTube(
  result: YouTubeSearchResult,
  genre: Genre = 'other'
): Track {
  return {
    id: uuidv4(),
    youtubeId: result.videoId,
    title: result.title,
    artist: result.channelTitle,
    duration: result.duration || 0,
    genre,
    thumbnail: result.thumbnail || getYouTubeThumbnail(result.videoId),
    addedAt: new Date(),
  };
}

/**
 * Parse artist and title from YouTube video title
 */
export function parseYouTubeTitle(title: string): { artist: string; title: string } {
  // Common patterns: "Artist - Title", "Artist | Title", "Artist: Title"
  const separators = [' - ', ' | ', ': ', ' – ', ' — '];

  for (const sep of separators) {
    if (title.includes(sep)) {
      const [artist, ...titleParts] = title.split(sep);
      return {
        artist: artist.trim(),
        title: titleParts.join(sep).trim(),
      };
    }
  }

  // If no separator found, return original title
  return {
    artist: 'Unknown Artist',
    title: title.trim(),
  };
}

/**
 * Generate YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    enablejsapi: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    ...(autoplay && { autoplay: '1' }),
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
