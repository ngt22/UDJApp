import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import StackNavigator

import DJScreen from '../screens/DJScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import AccountScreen from '../screens/AccountScreen';
import PlaylistEditScreen from '../screens/PlaylistEditScreen'; // Import Edit Screen

const Tab = createBottomTabNavigator();
const PlaylistStack = createNativeStackNavigator(); // Create a stack for playlist flow

// Playlist Stack Navigator
function PlaylistStackNavigator() {
  return (
    <PlaylistStack.Navigator>
      <PlaylistStack.Screen name="PlaylistList" component={PlaylistScreen} options={{ title: 'Your Playlists' }} />
      <PlaylistStack.Screen name="PlaylistEdit" component={PlaylistEditScreen} /* options dynamically set in screen, or like: options={({ route }) => ({ title: route.params.playlistName })} */ />
    </PlaylistStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator initialRouteName="DJ">
      <Tab.Screen
        name="PlaylistsTab" // Changed name to avoid conflict
        component={PlaylistStackNavigator} // Use the stack here
        options={{ title: 'Playlists', headerShown: false }} // Hide header for the tab itself
      />
      <Tab.Screen name="DJ" component={DJScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
