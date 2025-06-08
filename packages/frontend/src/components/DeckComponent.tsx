import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Modal, FlatList, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider'; // Use this if installed
import { Song, Playlist } from '../types/playlist'; // Adjust path
import { usePlaylists } from '../context/PlaylistContext'; // To select a playlist
import { useDJ } from '../context/DJContext'; // To interact with deck state

interface DeckComponentProps {
  deckId: 'A' | 'B';
  deckStatus: {
    playlistId: string | null;
    currentSong: Song | null;
    isPlaying: boolean;
    volume: number;
  };
}

export default function DeckComponent({ deckId, deckStatus }: DeckComponentProps) {
  const { playlists } = usePlaylists();
  const { setDeckPlaylist, setDeckCurrentSong, togglePlayPause, setVolume } = useDJ();
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [songModalVisible, setSongModalVisible] = useState(false);

  const currentPlaylist = playlists.find(p => p.id === deckStatus.playlistId);

  const selectPlaylist = (playlist: Playlist) => {
    setDeckPlaylist(deckId, playlist.id);
    // Optionally, auto-select first song or open song selection
    if (playlist.songs.length > 0) {
        // setDeckCurrentSong(deckId, playlist.songs[0]); // Auto-select first song
    } else {
        setDeckCurrentSong(deckId, null); // No songs in playlist
    }
    setPlaylistModalVisible(false);
  };

  const selectSong = (song: Song) => {
    setDeckCurrentSong(deckId, song);
    setSongModalVisible(false);
  };


  return (
    <View style={styles.deckContainer}>
      <Text style={styles.deckTitle}>Deck {deckId}</Text>

      <TouchableOpacity onPress={() => setPlaylistModalVisible(true)} style={styles.selectorButton}>
        <Text style={styles.selectorText}>
          Playlist: {currentPlaylist ? currentPlaylist.name : 'Select Playlist'}
        </Text>
      </TouchableOpacity>

      {deckStatus.playlistId && currentPlaylist && currentPlaylist.songs.length > 0 && (
        <TouchableOpacity onPress={() => setSongModalVisible(true)} style={styles.selectorButton}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.selectorText}>
                Song: {deckStatus.currentSong ? deckStatus.currentSong.title : 'Select Song'}
            </Text>
        </TouchableOpacity>
      )}


      {deckStatus.currentSong && (
        <View style={styles.songInfo}>
          <Image
            source={{ uri: deckStatus.currentSong.thumbnailUrl || 'https://via.placeholder.com/100' }}
            style={styles.thumbnail}
          />
          <Text style={styles.songTitle} numberOfLines={2}>{deckStatus.currentSong.title}</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Button title={deckStatus.isPlaying ? 'Pause' : 'Play'} onPress={() => togglePlayPause(deckId)} disabled={!deckStatus.currentSong} />
        {/* Waveform placeholder */}
        <View style={styles.waveformPlaceholder}><Text>Waveform</Text></View>
      </View>

      <View style={styles.volumeControl}>
        <Text style={{color: '#fff'}}>Volume:</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={deckStatus.volume}
          onValueChange={(value) => setVolume(deckId, value)}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>

      {/* Playlist Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={playlistModalVisible}
        onRequestClose={() => setPlaylistModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Playlist for Deck {deckId}</Text>
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectPlaylist(item)}>
                  <Text>{item.name} ({item.songs.length} songs)</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No playlists available.</Text>}
            />
            <Button title="Close" onPress={() => setPlaylistModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Song Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={songModalVisible && !!currentPlaylist}
        onRequestClose={() => setSongModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Song for Deck {deckId}</Text>
            <FlatList
              data={currentPlaylist?.songs || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectSong(item)}>
                  <Image source={{uri: item.thumbnailUrl || 'https://via.placeholder.com/40'}} style={styles.modalSongThumbnail} />
                  <Text style={styles.modalSongTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No songs in this playlist.</Text>}
            />
            <Button title="Close" onPress={() => setSongModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    backgroundColor: '#333', // Darker theme for decks
  },
  deckTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  selectorButton: { backgroundColor: '#555', padding:10, borderRadius:5, marginVertical: 5},
  selectorText: { color: '#fff', textAlign: 'center'},
  songInfo: { alignItems: 'center', marginVertical: 10 },
  thumbnail: { width: 100, height: 100, borderRadius: 5, backgroundColor: '#555' },
  songTitle: { color: '#fff', marginTop: 5, textAlign: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 },
  waveformPlaceholder: { flex:1, height: 50, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderRadius: 5},
  volumeControl: { marginTop: 10 },
  slider: { width: '100%', height: 40 },
  // Modal styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center'},
  modalSongThumbnail: { width: 40, height: 40, marginRight: 10, borderRadius: 3, backgroundColor: '#ccc'},
  modalSongTitle: {flex:1},
});
