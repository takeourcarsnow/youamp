// YouTube Search utilities

import { Track, Genre } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
}

// Parse ISO 8601 duration to seconds
export function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Convert YouTube search result to Track
export function youtubeResultToTrack(result: YouTubeSearchResult, durationSeconds?: number, genre?: Genre): Track {
  return {
    id: uuidv4(),
    youtubeId: result.videoId,
    title: result.title,
    artist: result.channelTitle,
    duration: durationSeconds || result.durationSeconds || 0,
    genre: genre || 'other' as Genre,
    thumbnail: result.thumbnail,
    addedAt: new Date(),
  };
}

// Search YouTube using the Data API (requires API key)
export async function searchYouTube(
  query: string,
  apiKey: string,
  maxResults: number = 20
): Promise<YouTubeSearchResult[]> {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }
    
    // Get video IDs for duration lookup
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Get video details including duration
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    
    return detailsData.items.map((item: any) => ({
      videoId: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      duration: item.contentDetails.duration,
    }));
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

// Piped API instances (generally more reliable)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.yt',
  'https://pipedapi.moomoo.me',
  'https://pipedapi.syncpundit.io',
];

// Invidious API instances
const INVIDIOUS_INSTANCES = [
  'https://invidious.privacyredirect.com',
  'https://invidious.nerdvpn.de',
  'https://inv.nadeko.net',
  'https://invidious.jing.rocks',
  'https://iv.datura.network',
  'https://invidious.protokolla.fi',
  'https://invidious.perennialte.ch',
];

// Search using Piped API
async function searchWithPiped(
  query: string,
  maxResults: number = 20
): Promise<YouTubeSearchResult[]> {
  for (const instance of PIPED_INSTANCES) {
    try {
      const url = `${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      const items = data.items || data;
      
      if (!Array.isArray(items) || items.length === 0) continue;
      
      return items
        .filter((item: any) => item.type === 'stream' || item.url || item.videoId)
        .slice(0, maxResults)
        .map((item: any) => {
          const videoId = item.url?.replace('/watch?v=', '') || item.videoId;
          return {
            videoId,
            title: item.title || 'Unknown',
            channelTitle: item.uploaderName || item.uploader || 'Unknown',
            thumbnail: item.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            durationSeconds: item.duration || 0,
          };
        });
    } catch (error) {
      console.warn(`Piped instance ${instance} failed:`, error);
      continue;
    }
  }
  
  return [];
}

// Search using Invidious API
async function searchWithInvidious(
  query: string,
  maxResults: number = 20
): Promise<YouTubeSearchResult[]> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) continue;
      
      return data.slice(0, maxResults).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
        durationSeconds: item.lengthSeconds || 0,
        duration: item.lengthSeconds ? `PT${Math.floor(item.lengthSeconds / 60)}M${item.lengthSeconds % 60}S` : undefined,
      }));
    } catch (error) {
      console.warn(`Invidious instance ${instance} failed:`, error);
      continue;
    }
  }
  
  return [];
}

// Main search function with fallbacks
export async function searchYouTubeInvidious(
  query: string,
  maxResults: number = 20
): Promise<YouTubeSearchResult[]> {
  // Try Piped first (generally more reliable)
  let results = await searchWithPiped(query, maxResults);
  
  if (results.length > 0) {
    console.log('Search succeeded with Piped API');
    return results;
  }
  
  // Fall back to Invidious
  results = await searchWithInvidious(query, maxResults);
  
  if (results.length > 0) {
    console.log('Search succeeded with Invidious API');
    return results;
  }
  
  console.warn('All search instances failed');
  return [];
}

// Search for a specific genre - generates fresh results from YouTube
export async function searchByGenre(
  genre: Genre,
  maxResults: number = 20
): Promise<Track[]> {
  // Genre-specific search queries for better results
  const genreQueries: Record<Genre, string[]> = {
    'rock': ['rock music 2024', 'classic rock hits', 'rock songs playlist'],
    'pop': ['pop music 2024', 'pop hits playlist', 'top pop songs'],
    'electronic': ['electronic music', 'EDM hits', 'electronic dance music'],
    'hip-hop': ['hip hop music 2024', 'rap hits playlist', 'hip hop songs'],
    'jazz': ['jazz music', 'smooth jazz', 'jazz classics'],
    'classical': ['classical music', 'classical piano', 'orchestra classical'],
    'metal': ['metal music', 'heavy metal hits', 'metal songs playlist'],
    'indie': ['indie music 2024', 'indie rock', 'indie pop playlist'],
    'r&b': ['r&b music', 'rnb songs 2024', 'r&b hits'],
    'country': ['country music', 'country hits 2024', 'country songs playlist'],
    'ambient': ['ambient music', 'chillout ambient', 'relaxing ambient'],
    'other': ['music mix', 'top songs', 'music playlist'],
  };
  
  const queries = genreQueries[genre] || genreQueries['other'];
  // Pick a random query variation for variety
  const query = queries[Math.floor(Math.random() * queries.length)];
  
  try {
    const results = await searchYouTubeInvidious(query, maxResults);
    return results.map(r => youtubeResultToTrack(r, r.durationSeconds, genre));
  } catch (error) {
    console.error('Genre search failed:', error);
    return [];
  }
}
