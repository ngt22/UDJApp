import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider'; // Use this if installed
import DeckComponent from '../components/DeckComponent'; // Adjust path
import { useDJ } from '../context/DJContext'; // Adjust path
import { useAuth } from '../context/AuthContext'; // To check if user is logged in

export default function DJScreen() {
  const { user } = useAuth();
  const { deckA, deckB, crossfaderValue, setCrossfader } = useDJ();

  if (!user) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.loginPromptText}>Please log in to use the DJ Decks.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>DJ Decks</Text>
      <DeckComponent deckId="A" deckStatus={deckA} />

      <View style={styles.crossfaderContainer}>
        <Text style={styles.crossfaderLabel}>Crossfader</Text>
        <Slider
          style={styles.crossfaderSlider}
          minimumValue={-1} // Full Deck A
          maximumValue={1}  // Full Deck B
          value={crossfaderValue}
          onValueChange={setCrossfader}
          minimumTrackTintColor="#5E5CE6" // Accent color
          maximumTrackTintColor="#787880"
          thumbTintColor="#FFFFFF"
        />
        <View style={styles.faderLabels}>
            <Text style={styles.faderLabelText}>Deck A</Text>
            <Text style={styles.faderLabelText}>Deck B</Text>
        </View>
      </View>

      <DeckComponent deckId="B" deckStatus={deckB} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#1c1c1e', // Overall dark theme
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  loginPromptText: {
    fontSize: 18,
    color: '#E5E5EA',
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  crossfaderContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
  },
  crossfaderLabel: {
    textAlign: 'center',
    color: '#E5E5EA',
    fontSize: 16,
    marginBottom: 5,
  },
  crossfaderSlider: {
    width: '100%',
    height: 40,
  },
  faderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Adjust as needed
  },
  faderLabelText: {
    color: '#8E8E93', // Lighter gray for labels
    fontSize: 12,
  }
});
