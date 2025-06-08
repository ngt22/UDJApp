import React from 'react';
import { Song } from '../types';
import './CurrentPlaylistDisplay.css';

interface Props {
  songs: Song[];
}

const CurrentPlaylistDisplay: React.FC<Props> = ({ songs }) => {
  return (
    <section className="current-playlist">
      <h2>Now Playing / Up Next</h2>
      {songs.length === 0 ? (
        <p>The DJ hasn't shared their current playlist yet.</p>
      ) : (
        <ul>
          {songs.map((song, index) => (
            <li key={song.id} className="song-item">
              <img src={song.thumbnailUrl || 'https://via.placeholder.com/60?text=Song'} alt={song.title} className="thumbnail" />
              <div className="song-details">
                <span className="title">{song.title}</span>
                {index === 0 && <span className="status-playing">(Now Playing)</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default CurrentPlaylistDisplay;
