import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';

// WebBrowser.maybeCompleteAuthSession(); // For Google OAuth redirect

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string, avatar?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual Google Sign-In configuration
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: 'YOUR_EXPO_GO_CLIENT_ID', // Replace with your Expo Go client ID
  //   iosClientId: 'YOUR_IOS_CLIENT_ID',    // Replace with your iOS client ID
  //   androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace with your Android client ID
  //   webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Web client ID
  // });

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem('@UDJ:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     // Here you would typically exchange the auth code for tokens with your backend
  //     // and then fetch user profile. For now, we'll mock it.
  //     console.log('Google Auth Response:', authentication);
  //     const mockUser: User = {
  //       id: 'mock-user-id',
  //       name: 'Mock User',
  //       email: 'mock.user@example.com',
  //     };
  //     setUser(mockUser);
  //     AsyncStorage.setItem('@UDJ:user', JSON.stringify(mockUser));
  //   } else if (response?.type === 'error') {
  //     console.error('Google Auth Error:', response.error);
  //     // Handle error, maybe show a message to the user
  //   }
  // }, [response]);

  const signIn = async () => {
    // await promptAsync(); // This would trigger Google OAuth
    // For now, simulate login:
    console.log("Simulating Sign In");
    const mockUser: User = {
      id: 'mock-user-id-' + Date.now(),
      name: 'Test User',
      email: 'test.user@example.com',
    };
    setUser(mockUser);
    await AsyncStorage.setItem('@UDJ:user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@UDJ:user');
    console.log("User signed out");
  };

  const updateProfile = async (name: string, avatar?: string) => {
    if (user) {
      const updatedUser = { ...user, name, avatar: avatar ?? user.avatar };
      setUser(updatedUser);
      await AsyncStorage.setItem('@UDJ:user', JSON.stringify(updatedUser));
      console.log("Profile updated", updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
