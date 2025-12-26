// Sample music data for demo purposes

import { v4 as uuidv4 } from 'uuid';
import { Track, Genre } from '@/types';

// Sample tracks from YouTube (using real YouTube video IDs)
export const SAMPLE_TRACKS: Track[] = [
  {
    id: uuidv4(),
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    duration: 213,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 354,
    genre: 'rock',
    thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'hTWKbfoikeg',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: 301,
    genre: 'rock',
    thumbnail: 'https://img.youtube.com/vi/hTWKbfoikeg/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: '9bZkp7q19f0',
    title: 'Gangnam Style',
    artist: 'PSY',
    album: 'Psy 6 (Six Rules), Part 1',
    duration: 253,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'Vida',
    duration: 282,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'RgKAFK5djSk',
    title: 'See You Again',
    artist: 'Wiz Khalifa ft. Charlie Puth',
    album: 'Furious 7 Soundtrack',
    duration: 237,
    genre: 'hip-hop',
    thumbnail: 'https://img.youtube.com/vi/RgKAFK5djSk/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 234,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'OPf0YbXqDm0',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    duration: 270,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'YQHsXMglC9A',
    title: 'Hello',
    artist: 'Adele',
    album: '25',
    duration: 295,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/YQHsXMglC9A/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'e-ORhEE9VVg',
    title: 'Take On Me',
    artist: 'a-ha',
    album: 'Hunting High and Low',
    duration: 226,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/djV11Xbc914/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'Zi_XLOBDo_Y',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: 294,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/Zi_XLOBDo_Y/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'btPJPFnesV4',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    album: 'Eye of the Tiger',
    duration: 245,
    genre: 'rock',
    thumbnail: 'https://img.youtube.com/vi/btPJPFnesV4/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'YkgkThdzX-8',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: 302,
    genre: 'rock',
    thumbnail: 'https://img.youtube.com/vi/1w7OgIMMRc4/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'oRdxUFDoQe0',
    title: 'Break My Soul',
    artist: 'Beyoncé',
    album: 'Renaissance',
    duration: 279,
    genre: 'electronic',
    thumbnail: 'https://img.youtube.com/vi/oRdxUFDoQe0/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'CevxZvSJLk8',
    title: 'Rockstar',
    artist: 'Post Malone ft. 21 Savage',
    album: 'Beerbongs & Bentleys',
    duration: 218,
    genre: 'hip-hop',
    thumbnail: 'https://img.youtube.com/vi/UceaB4D0jpo/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'IcrbM1l_BoI',
    title: 'Wake Me Up',
    artist: 'Avicii',
    album: 'True',
    duration: 249,
    genre: 'electronic',
    thumbnail: 'https://img.youtube.com/vi/IcrbM1l_BoI/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: '60ItHLz5WEA',
    title: 'Alan Walker - Faded',
    artist: 'Alan Walker',
    album: 'Different World',
    duration: 212,
    genre: 'electronic',
    thumbnail: 'https://img.youtube.com/vi/60ItHLz5WEA/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'nfs8NYg7yQM',
    title: 'HUMBLE.',
    artist: 'Kendrick Lamar',
    album: 'DAMN.',
    duration: 177,
    genre: 'hip-hop',
    thumbnail: 'https://img.youtube.com/vi/tvTRZJ-4EyI/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: '2Vv-BfVoq4g',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 263,
    genre: 'pop',
    thumbnail: 'https://img.youtube.com/vi/2Vv-BfVoq4g/mqdefault.jpg',
    addedAt: new Date(),
  },
  {
    id: uuidv4(),
    youtubeId: 'papuvlVeZg8',
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    album: 'Blurryface',
    duration: 202,
    genre: 'indie',
    thumbnail: 'https://img.youtube.com/vi/pXRviuL6vMY/mqdefault.jpg',
    addedAt: new Date(),
  },
];

// Group tracks by genre
export function getTracksByGenre(genre: Genre): Track[] {
  return SAMPLE_TRACKS.filter((track) => track.genre === genre);
}

// Get all unique artists
export function getAllArtists(): string[] {
  const artists = new Set(SAMPLE_TRACKS.map((track) => track.artist));
  return Array.from(artists).sort();
}

// Get tracks by artist
export function getTracksByArtist(artist: string): Track[] {
  return SAMPLE_TRACKS.filter((track) =>
    track.artist.toLowerCase().includes(artist.toLowerCase())
  );
}

// Get random tracks
export function getRandomTracks(count: number): Track[] {
  const shuffled = [...SAMPLE_TRACKS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Search tracks
export function searchTracks(query: string): Track[] {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_TRACKS.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      (track.album && track.album.toLowerCase().includes(lowerQuery))
  );
}
