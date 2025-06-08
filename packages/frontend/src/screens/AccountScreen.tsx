import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function AccountScreen() {
  const { user, signIn, signOut, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(user?.avatar);

  React.useEffect(() => {
    setName(user?.name || '');
    setSelectedAvatar(user?.avatar);
  }, [user]);

  const handleChooseAvatar = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedAvatar(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
        await updateProfile(name, selectedAvatar);
        Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
        Alert.alert('Error', 'Failed to update profile.');
        console.error(error);
    }
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
            // Actual deletion logic will be implemented later with backend
            console.log("Account deletion requested by user.");
            signOut(); // For now, just sign out
            Alert.alert("Account Deleted", "Your account has been deleted (simulated).");
        }}
      ]
    );
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to UDJ</Text>
        <Text>Please sign in to continue.</Text>
        <Button title="Sign In with Google (Simulated)" onPress={signIn} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Image source={{ uri: selectedAvatar || 'https://via.placeholder.com/100' }} style={styles.avatar} />
      <Button title="Change Avatar" onPress={handleChooseAvatar} />

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.emailText}>{user.email} (Cannot be changed)</Text>

      <Button title="Save Changes" onPress={handleSaveChanges} />
      <View style={styles.separator} />
      <Button title="Sign Out" onPress={signOut} color="red" />
      <View style={styles.separator} />
      <Button title="Delete Account" onPress={handleAccountDeletion} color="darkred" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#555',
    width: '100%',
    paddingVertical: 10,
  },
  separator: {
    marginVertical: 10,
  }
});
