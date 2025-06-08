import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist, Song } from '../types/playlist'; // Adjust path if necessary
import uuid from 'react-native-uuid';

interface PlaylistContextData {
  playlists: Playlist[];
  isLoading: boolean;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  renamePlaylist: (playlistId: string, newName: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  reorderSongsInPlaylist: (playlistId: string, songs: Song[]) => Promise<void>;
  getPlaylistById: (playlistId: string) => Playlist | undefined;
}

const PlaylistContext = createContext<PlaylistContextData>({} as PlaylistContextData);

const MOCK_SONGS: Song[] = [
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up - Rick Astley', thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '3JZ_D3ELwOQ', title: 'Gangnam Style - PSY', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' },
];

const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'mock-playlist-1', name: 'My Favorites', songs: MOCK_SONGS },
  { id: 'mock-playlist-2', name: 'Workout Mix', songs: [] },
];

export const PlaylistProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      setIsLoading(true);
      const storedPlaylists = await AsyncStorage.getItem('@UDJ:playlists');
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists));
      } else {
        // Initialize with mock data if nothing in storage
        setPlaylists(MOCK_PLAYLISTS);
        await AsyncStorage.setItem('@UDJ:playlists', JSON.stringify(MOCK_PLAYLISTS));
      }
      setIsLoading(false);
    };
    loadPlaylists();
  }, []);

  const persistPlaylists = async (updatedPlaylists: Playlist[]) => {
    setPlaylists(updatedPlaylists);
    await AsyncStorage.setItem('@UDJ:playlists', JSON.stringify(updatedPlaylists));
  };

  const createPlaylist = async (name: string) => {
    const newPlaylist: Playlist = { id: uuid.v4() as string, name, songs: [] };
    const updatedPlaylists = [...playlists, newPlaylist];
    await persistPlaylists(updatedPlaylists);
  };

  const deletePlaylist = async (playlistId: string) => {
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    await persistPlaylists(updatedPlaylists);
  };

  const renamePlaylist = async (playlistId: string, newName: string) => {
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId ? { ...p, name: newName } : p
    );
    await persistPlaylists(updatedPlaylists);
  };

  const addSongToPlaylist = async (playlistId: string, song: Song) => {
    // Simulate fetching song details for now if only URL is given
    if (!song.title && song.id) { // Assuming song.id might be a URL or partial ID
        song.title = `Fetched Title for ${song.id}`;
        song.thumbnailUrl = `https://via.placeholder.com/100?text=${song.id}`;
    }
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    );
    await persistPlaylists(updatedPlaylists);
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId ? { ...p, songs: p.songs.filter(s => s.id !== songId) } : p
    );
    await persistPlaylists(updatedPlaylists);
  };

  const reorderSongsInPlaylist = async (playlistId: string, songs: Song[]) => {
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId ? { ...p, songs } : p
    );
    await persistPlaylists(updatedPlaylists);
  };

  const getPlaylistById = (playlistId: string) => {
    return playlists.find(p => p.id === playlistId);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, isLoading, createPlaylist, deletePlaylist, renamePlaylist, addSongToPlaylist, removeSongFromPlaylist, reorderSongsInPlaylist, getPlaylistById }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => useContext(PlaylistContext);
