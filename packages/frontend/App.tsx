// packages/frontend/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { PlaylistProvider } from './src/context/PlaylistContext';
import { DJProvider } from './src/context/DJContext'; // Import DJProvider

export default function App() {
  return (
    <AuthProvider>
      <PlaylistProvider>
        <DJProvider> {/* Wrap with DJProvider */}
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </DJProvider>
      </PlaylistProvider>
    </AuthProvider>
  );
}
