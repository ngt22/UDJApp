import React, { useState } from 'react';
import { Song } from '../types';
import './SongRequestForm.css';

interface Props {
  onSongRequested: (song: Song) => void;
}

const MOCK_SEARCH_RESULTS: Song[] = [
  { id: 'search-res-1', title: 'Mock Result: Sunshine Lollipops', thumbnailUrl: 'https://via.placeholder.com/60?text=S1' },
  { id: 'search-res-2', title: 'Mock Result: Rainbows Everywhere', thumbnailUrl: 'https://via.placeholder.com/60?text=S2' },
  { id: 'search-res-3', title: 'Mock Result: Happy Times', thumbnailUrl: 'https://via.placeholder.com/60?text=S3' },
];

const SongRequestForm: React.FC<Props> = ({ onSongRequested }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoadingSearch(true);
    // Simulate API call for search
    setTimeout(() => {
      // Filter mock results based on search term for a bit more realism
      const filteredResults = MOCK_SEARCH_RESULTS.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults.length > 0 ? filteredResults : [{id: 'not-found', title: `No mock results for "${searchTerm}"`}]);
      setIsLoadingSearch(false);
    }, 500);
  };

  const requestSong = (song: Song) => {
    if (song.id === 'not-found') return; // Don't request the "not found" message
    onSongRequested(song);
    setSearchTerm(''); // Clear search
    setSearchResults([]); // Clear results
  };

  return (
    <section className="song-request-form">
      <h2>Request a Song</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search YouTube (e.g., song title, artist)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={isLoadingSearch}>
          {isLoadingSearch ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map(song => (
              <li key={song.id} className="result-item">
                <img src={song.thumbnailUrl || 'https://via.placeholder.com/40?text=S'} alt={song.title} className="thumbnail-small" />
                <span>{song.title}</span>
                {song.id !== 'not-found' && <button onClick={() => requestSong(song)} className="request-button">Request</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export default SongRequestForm;
