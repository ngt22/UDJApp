import React, { useState, useEffect } from 'react';
import './App.css'; // Keep or update this for global styles
import CurrentPlaylistDisplay from './components/CurrentPlaylistDisplay';
import SongRequestForm from './components/SongRequestForm';
import RequestedSongsList from './components/RequestedSongsList';
import { Song, CurrentDJPlaylist, RequestedSong } from './types';

// Mock Data
const MOCK_DJ_PLAYLIST: CurrentDJPlaylist = {
  name: "DJ Cool's Live Set",
  songs: [
    { id: 'dj-song-1', title: 'Currently Playing: Awesome Beat', thumbnailUrl: 'https://via.placeholder.com/80?text=DJ1', votes: 0 },
    { id: 'dj-song-2', title: 'Up Next: Another Great Track', thumbnailUrl: 'https://via.placeholder.com/80?text=DJ2', votes: 0 },
  ],
};

const MOCK_REQUESTED_SONGS: RequestedSong[] = [
  { id: 'req-song-1', title: 'Summer Vibes - Requested by Listener1', thumbnailUrl: 'https://via.placeholder.com/80?text=R1', votes: 5 },
  { id: 'req-song-2', title: 'Dance Anthem - Requested by Listener2', thumbnailUrl: 'https://via.placeholder.com/80?text=R2', votes: 12 },
];

function App() {
  const [currentPlaylist, setCurrentPlaylist] = useState<CurrentDJPlaylist | null>(null);
  const [requestedSongs, setRequestedSongs] = useState<RequestedSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPlaylist(MOCK_DJ_PLAYLIST);
      setRequestedSongs(MOCK_REQUESTED_SONGS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSongRequested = (song: Song) => {
    // Simulate adding a song to the requested list
    const newRequest: RequestedSong = { ...song, votes: 1, requestedBy: 'You' };
    setRequestedSongs(prev => [newRequest, ...prev].sort((a,b) => (b.votes || 0) - (a.votes || 0))); // Keep sorted
    alert(`Song "${song.title}" requested!`);
  };

  const handleVote = (songId: string) => {
    // Simulate voting
    setRequestedSongs(prev =>
      prev.map(song =>
        song.id === songId ? { ...song, votes: (song.votes || 0) + 1 } : song
      ).sort((a,b) => (b.votes || 0) - (a.votes || 0)) // Keep sorted
    );
  };

  if (isLoading) {
    return <div className="loading-container"><p>Loading DJ's session...</p></div>;
  }

  return (
    <div className="container">
      <header>
        <h1>{currentPlaylist?.name || "DJ Session Requests"}</h1>
        <p>Request songs for the current DJ set!</p>
      </header>

      <main>
        <CurrentPlaylistDisplay songs={currentPlaylist?.songs || []} />
        <SongRequestForm onSongRequested={handleSongRequested} />
        <RequestedSongsList requestedSongs={requestedSongs} onVote={handleVote} />
      </main>

      <footer>
        <p>UDJ Web Request Page - Powered by React</p>
      </footer>
    </div>
  );
}

export default App;
