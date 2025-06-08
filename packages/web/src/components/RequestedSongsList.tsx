import React from 'react';
import { RequestedSong } from '../types';
import './RequestedSongsList.css';

interface Props {
  requestedSongs: RequestedSong[];
  onVote: (songId: string) => void;
}

const RequestedSongsList: React.FC<Props> = ({ requestedSongs, onVote }) => {
  return (
    <section className="requested-songs-list">
      <h2>Listener Requests ({requestedSongs.length})</h2>
      {requestedSongs.length === 0 ? (
        <p>No songs requested yet. Be the first!</p>
      ) : (
        <ul>
          {requestedSongs.sort((a,b) => (b.votes || 0) - (a.votes || 0)).map(song => (
            <li key={song.id} className="requested-song-item">
              <img src={song.thumbnailUrl || 'https://via.placeholder.com/60?text=R'} alt={song.title} className="thumbnail" />
              <div className="song-info">
                <span className="title">{song.title}</span>
                {song.requestedBy && <span className="requested-by">Requested by: {song.requestedBy}</span>}
              </div>
              <div className="vote-section">
                <button onClick={() => onVote(song.id)} className="vote-button">
                  👍 Vote
                </button>
                <span className="votes">({song.votes || 0})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RequestedSongsList;
