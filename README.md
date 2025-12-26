# YouAmp - Winamp-style YouTube Music Player

A nostalgic Winamp-inspired music player web application that plays YouTube videos. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🎵 Music Player
- Classic Winamp-style interface with draggable windows
- Play, pause, stop, previous, next controls
- Volume control with mute toggle
- Seek bar for track navigation
- Time display (elapsed/remaining)
- Real-time audio visualization

### 📊 Equalizer
- 10-band graphic equalizer
- Preamp control
- Multiple presets (Rock, Pop, Jazz, Classical, Electronic, etc.)
- Enable/disable toggle

### 📝 Playlist
- Add/remove tracks
- Drag and drop reordering
- Track duration display
- Clear playlist option
- Visual indication of current track

### 🔍 Music Browser
- Browse all tracks
- Filter by genre
- Filter by artist
- Search functionality
- Random 10 tracks
- Shuffle all tracks
- Add individual or all tracks to playlist

### 🎨 Themes
- Dark theme (classic Winamp look)
- Light theme
- Toggle via menu bar or main window

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause
- `M` - Mute/Unmute
- `S` - Toggle shuffle
- `R` - Toggle repeat mode
- `Ctrl + →` - Next track
- `Ctrl + ←` - Previous track
- `↑/↓` - Volume up/down

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **YouTube Integration**: react-youtube
- **Deployment**: Ready for Vercel + Supabase

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── layout/            # Layout components
│   │   ├── Desktop.tsx    # Main desktop area
│   │   └── MenuBar.tsx    # Top menu bar
│   ├── player/            # Player components
│   │   ├── BitrateDisplay.tsx
│   │   ├── PlaybackModes.tsx
│   │   ├── SeekBar.tsx
│   │   ├── TimeDisplay.tsx
│   │   ├── TrackInfo.tsx
│   │   ├── TransportControls.tsx
│   │   ├── VolumeControl.tsx
│   │   └── YouTubePlayerWrapper.tsx
│   ├── providers/         # React providers
│   │   └── ThemeProvider.tsx
│   ├── ui/                # Reusable UI components
│   │   ├── LEDDisplay.tsx
│   │   ├── MarqueeText.tsx
│   │   ├── Visualization.tsx
│   │   ├── WinampButton.tsx
│   │   ├── WinampSlider.tsx
│   │   └── WinampWindow.tsx
│   ├── windows/           # Window components
│   │   ├── BrowserWindow.tsx
│   │   ├── EqualizerWindow.tsx
│   │   ├── MainWindow.tsx
│   │   └── PlaylistWindow.tsx
│   └── App.tsx            # Main App component
├── hooks/                 # Custom hooks
│   ├── useDraggable.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useLocalStorage.ts
│   └── useMarquee.ts
├── lib/
│   ├── data/             # Sample data
│   │   └── sampleTracks.ts
│   └── utils/            # Utility functions
│       ├── helpers.ts
│       ├── time.ts
│       └── youtube.ts
├── store/                # Zustand stores
│   ├── equalizerStore.ts
│   ├── playerStore.ts
│   ├── playlistStore.ts
│   └── uiStore.ts
├── styles/               # CSS styles
│   ├── light-theme.css
│   └── winamp.css
└── types/                # TypeScript types
    ├── index.ts
    └── player.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy

### Supabase Integration (Future)

The app is designed to integrate with Supabase for:
- User authentication
- Saving playlists to the cloud
- User preferences sync
- Custom track libraries

## Environment Variables

Create a `.env.local` file for future integrations:

```env
# YouTube API (optional, for search functionality)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here

# Supabase (for future cloud features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## License

MIT License

## Acknowledgments

- Inspired by the classic Winamp media player
- Uses sample tracks from YouTube for demonstration
