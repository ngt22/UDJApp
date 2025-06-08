import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { usePlaylists } from '../context/PlaylistContext';
import { Playlist } from '../types/playlist'; // Adjust path
// import { useNavigation } from '@react-navigation/native'; // For navigation to edit screen

// Define a type for the navigation prop if you're using it directly.
// For simplicity, we'll use a modal for editing name here, and a separate screen for songs.
// type PlaylistScreenNavigationProp = StackNavigationProp<YourRootStackParamList, 'PlaylistList'>;


export default function PlaylistScreen({ navigation }) { // Assuming navigation prop is passed by React Navigation
  const { playlists, isLoading, createPlaylist, deletePlaylist, renamePlaylist } = usePlaylists();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  // const navigation = useNavigation<PlaylistScreenNavigationProp>(); // Hook for type safety

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() === '') {
      Alert.alert('Error', 'Playlist name cannot be empty.');
      return;
    }
    createPlaylist(newPlaylistName);
    setNewPlaylistName('');
    setModalVisible(false);
  };

  const openRenameModal = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistName(playlist.name);
    setModalVisible(true);
  };

  const handleRenamePlaylist = () => {
    if (!editingPlaylist || newPlaylistName.trim() === '') {
      Alert.alert('Error', 'Playlist name cannot be empty.');
      return;
    }
    renamePlaylist(editingPlaylist.id, newPlaylistName);
    setNewPlaylistName('');
    setEditingPlaylist(null);
    setModalVisible(false);
  };

  const confirmDeletePlaylist = (playlistId: string) => {
    Alert.alert('Delete Playlist', 'Are you sure you want to delete this playlist?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlaylist(playlistId) },
    ]);
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading playlists...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => navigation.navigate('PlaylistEdit', { playlistId: item.id, playlistName: item.name })}
          >
            <Text style={styles.playlistName}>{item.name} ({item.songs.length} songs)</Text>
            <View style={styles.actions}>
              <Button title="Rename" onPress={() => openRenameModal(item)} />
              <View style={{width: 10}} />
              <Button title="Delete" color="red" onPress={() => confirmDeletePlaylist(item.id)} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No playlists yet. Create one!</Text>}
      />
      <Button title="Create New Playlist" onPress={() => { setEditingPlaylist(null); setModalVisible(true); }} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEditingPlaylist(null);
          setNewPlaylistName('');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{editingPlaylist ? 'Rename Playlist' : 'New Playlist Name:'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter playlist name"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
            />
            <Button title={editingPlaylist ? 'Save Name' : 'Create Playlist'} onPress={editingPlaylist ? handleRenamePlaylist : handleCreatePlaylist} />
            <View style={{marginTop:10}} />
            <Button title="Cancel" onPress={() => {setModalVisible(false); setEditingPlaylist(null); setNewPlaylistName('');}} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  playlistItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  playlistName: { fontSize: 18, fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: '80%' },
  modalText: { marginBottom: 15, textAlign: 'center', fontSize: 18 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, width: '100%', borderRadius: 5 },
});
