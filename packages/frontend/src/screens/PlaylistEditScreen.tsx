import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import { usePlaylists } from '../context/PlaylistContext';
import { Song } from '../types/playlist'; // Adjust path

// Mock DraggableFlatList for now if setup is too complex for one subtask
const DraggableFlatList = FlatList; // Replace with actual import later

export default function PlaylistEditScreen({ route, navigation }) {
  const { playlistId, playlistName } = route.params;
  const { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist, reorderSongsInPlaylist } = usePlaylists();

  const [playlist, setPlaylist] = useState(getPlaylistById(playlistId));
  const [songUrlOrId, setSongUrlOrId] = useState('');
  const [mockSearchResults, setMockSearchResults] = useState<Song[]>([]);

  useEffect(() => {
    // Update local playlist state if context changes (e.g., song added/removed)
    const currentPlaylist = getPlaylistById(playlistId);
    setPlaylist(currentPlaylist);
    navigation.setOptions({ title: currentPlaylist?.name || 'Edit Playlist' });
  }, [playlistId, getPlaylistById, navigation, playlists]); // Added playlists to dependency array to react to context changes

  const handleAddSong = () => {
    if (songUrlOrId.trim() === '') {
      Alert.alert('Error', 'Please enter a YouTube URL or Video ID.');
      return;
    }
    // Mock: in reality, you'd use YouTube API to get details if it's a valid ID/URL
    const newSong: Song = {
      id: songUrlOrId, // Assume it's a valid ID for now
      title: `Song: ${songUrlOrId.substring(0,20)}...`, // Placeholder title
      thumbnailUrl: `https://i.ytimg.com/vi/${songUrlOrId}/hqdefault.jpg` // Basic thumbnail guess
    };
    addSongToPlaylist(playlistId, newSong);
    setSongUrlOrId('');
    setMockSearchResults([]); // Clear mock search
  };

  const handleMockSearch = () => {
    if (songUrlOrId.trim() === '') {
        setMockSearchResults([]);
        return;
    }
    // Simulate search results
    setMockSearchResults([
        { id: 'VIDEO_ID_1_' + songUrlOrId, title: `Search Result 1 for ${songUrlOrId}`, thumbnailUrl: 'https://via.placeholder.com/80?text=S1' },
        { id: 'VIDEO_ID_2_' + songUrlOrId, title: `Search Result 2 for ${songUrlOrId}`, thumbnailUrl: 'https://via.placeholder.com/80?text=S2' },
    ]);
  };

  const selectSearchedSong = (song: Song) => {
    addSongToPlaylist(playlistId, song);
    setSongUrlOrId('');
    setMockSearchResults([]);
  };

  const confirmRemoveSong = (songId: string) => {
    Alert.alert('Remove Song', 'Are you sure you want to remove this song?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeSongFromPlaylist(playlistId, songId) },
    ]);
  };

  // const renderItem = ({ item, drag, isActive }: RenderItemParams<Song>) => (
  //   <ScaleDecorator>
  //     <TouchableOpacity
  //       onLongPress={drag}
  //       disabled={isActive}
  //       style={[styles.songItem, isActive && styles.songItemActive]}
  //     >
  //       <Image source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/60' }} style={styles.thumbnail} />
  //       <Text style={styles.songTitle}>{item.title}</Text>
  //       <Button title="Remove" color="tomato" onPress={() => confirmRemoveSong(item.id)} />
  //     </TouchableOpacity>
  //   </ScaleDecorator>
  // );

  if (!playlist) {
    return <View style={styles.container}><Text>Playlist not found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Title is set in navigation options */}
      {/* <Text style={styles.title}>{playlist.name}</Text> */}

      <View style={styles.addSongContainer}>
        <TextInput
          style={styles.input}
          placeholder="YouTube URL or Video ID / Search Keyword"
          value={songUrlOrId}
          onChangeText={setSongUrlOrId}
        />
        <View style={styles.buttonGroup}>
            <Button title="Search (Mock)" onPress={handleMockSearch} />
            <Button title="Add by ID/URL" onPress={handleAddSong} />
        </View>
      </View>

      {mockSearchResults.length > 0 && (
        <FlatList
          data={mockSearchResults}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.searchResultItem} onPress={() => selectSearchedSong(item)}>
              <Image source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/40' }} style={styles.searchThumbnail} />
              <Text style={styles.searchTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          style={styles.searchResultsContainer}
        />
      )}
      <Text style={styles.subHeader}>Songs in Playlist:</Text>
      {/* Replace FlatList with DraggableFlatList once installed and configured */}
      <DraggableFlatList // Using the alias to FlatList
        data={playlist.songs}
        keyExtractor={(item) => item.id}
        // renderItem={renderItem} // For DraggableFlatList
        renderItem={({item}) => ( // Simple FlatList renderItem
            <View style={styles.songItem}>
                <Image source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/60' }} style={styles.thumbnail} />
                <Text style={styles.songTitle} numberOfLines={2}>{item.title}</Text>
                <Button title="Remove" color="tomato" onPress={() => confirmRemoveSong(item.id)} />
            </View>
        )}
        // onDragEnd={({ data }) => reorderSongsInPlaylist(playlistId, data)} // For DraggableFlatList
        ListEmptyComponent={<Text style={styles.emptyText}>This playlist is empty. Add some songs!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' }, // Changed background for better contrast
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10},
  addSongContainer: { marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }, // Lightened background
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, backgroundColor: 'white', borderRadius: 5 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-around'},
  songItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white', borderRadius: 5, marginBottom: 5},
  songItemActive: { backgroundColor: '#e0e0e0', elevation: 3 },
  thumbnail: { width: 60, height: 60, marginRight: 10, borderRadius: 4, backgroundColor: '#ccc' },
  songTitle: { flex: 1, fontSize: 16, marginRight: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#666'}, // Styled empty text
  searchResultsContainer: { maxHeight: 150, borderWidth:1, borderColor: '#ddd', borderRadius: 5, marginVertical: 10, backgroundColor: '#fafafa'}, // Styled search results
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth:1, borderBottomColor: '#eee'},
  searchThumbnail: { width: 40, height: 40, marginRight: 10, borderRadius: 3, backgroundColor: '#ccc'},
  searchTitle: {flex: 1, fontSize: 14},
});
