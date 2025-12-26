// YouTube Search utilities

import { Track, Genre } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
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
export function youtubeResultToTrack(result: YouTubeSearchResult, durationSeconds?: number): Track {
  return {
    id: uuidv4(),
    youtubeId: result.videoId,
    title: result.title,
    artist: result.channelTitle,
    duration: durationSeconds || 0,
    genre: 'other' as Genre,
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

// Alternative: Search using Invidious API (no API key required)
export async function searchYouTubeInvidious(
  query: string,
  maxResults: number = 20
): Promise<YouTubeSearchResult[]> {
  const instances = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://invidious.jing.rocks',
  ];
  
  for (const instance of instances) {
    try {
      const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
      const response = await fetch(url, { 
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      return data.slice(0, maxResults).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
        duration: item.lengthSeconds ? `PT${Math.floor(item.lengthSeconds / 60)}M${item.lengthSeconds % 60}S` : undefined,
      }));
    } catch (error) {
      console.warn(`Invidious instance ${instance} failed:`, error);
      continue;
    }
  }
  
  return [];
}
