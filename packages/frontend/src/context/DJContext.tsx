import React, { createContext, useState, useContext } from 'react';
import { Playlist, Song } from '../types/playlist'; // Adjust path

interface DeckStatus {
  playlistId: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  // Add other deck-specific states later: progress, cue points, etc.
}

interface DJContextData {
  deckA: DeckStatus;
  deckB: DeckStatus;
  crossfaderValue: number; // -1 (Deck A) to 1 (Deck B), 0 is center
  setDeckPlaylist: (deck: 'A' | 'B', playlistId: string) => void;
  setDeckCurrentSong: (deck: 'A' | 'B', song: Song | null) => void;
  togglePlayPause: (deck: 'A' | 'B') => void;
  setVolume: (deck: 'A' | 'B', volume: number) => void;
  setCrossfader: (value: number) => void;
  // Add more actions as features are implemented
}

const initialDeckStatus: DeckStatus = {
  playlistId: null,
  currentSong: null,
  isPlaying: false,
  volume: 0.75,
};

const DJContext = createContext<DJContextData>({} as DJContextData);

export const DJProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [deckA, setDeckA] = useState<DeckStatus>(initialDeckStatus);
  const [deckB, setDeckB] = useState<DeckStatus>(initialDeckStatus);
  const [crossfaderValue, setCrossfaderValue] = useState(0);

  const setDeckPlaylist = (deck: 'A' | 'B', playlistId: string) => {
    const setter = deck === 'A' ? setDeckA : setDeckB;
    // In a real app, you might auto-load the first song or allow selection
    setter(prev => ({ ...prev, playlistId, currentSong: null, isPlaying: false }));
    console.log(`Deck ${deck} playlist set to: ${playlistId}`);
  };

  const setDeckCurrentSong = (deck: 'A' | 'B', song: Song | null) => {
    const setter = deck === 'A' ? setDeckA : setDeckB;
    setter(prev => ({ ...prev, currentSong: song, isPlaying: !!song })); // Auto-play if song selected? For now, yes.
    console.log(`Deck ${deck} current song set to: ${song?.title}`);
  };

  const togglePlayPause = (deck: 'A' | 'B') => {
    const setter = deck === 'A' ? setDeckA : setDeckB;
    setter(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    console.log(`Deck ${deck} play/pause toggled`);
  };

  const setVolume = (deck: 'A' | 'B', volume: number) => {
    const setter = deck === 'A' ? setDeckA : setDeckB;
    setter(prev => ({ ...prev, volume }));
  };

  const setCrossfader = (value: number) => {
    setCrossfaderValue(Math.max(-1, Math.min(1, value)));
  };

  return (
    <DJContext.Provider value={{ deckA, deckB, crossfaderValue, setDeckPlaylist, setDeckCurrentSong, togglePlayPause, setVolume, setCrossfader }}>
      {children}
    </DJContext.Provider>
  );
};

export const useDJ = () => useContext(DJContext);
