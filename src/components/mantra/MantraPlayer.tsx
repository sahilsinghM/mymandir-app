import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors, shadows } from '../../theme/colors';

interface Mantra {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  isFavorite?: boolean;
}

interface MantraPlayerProps {
  onMantraComplete?: (mantra: Mantra) => void;
}

const MANTRA_LIST: Mantra[] = [
  {
    id: '1',
    title: 'Om Namah Shivaya',
    description: 'Sacred chant dedicated to Lord Shiva',
    duration: '5:30',
    url: 'https://example.com/om-namah-shivaya.mp3',
  },
  {
    id: '2',
    title: 'Gayatri Mantra',
    description: 'Universal prayer for enlightenment',
    duration: '3:45',
    url: 'https://example.com/gayatri-mantra.mp3',
  },
  {
    id: '3',
    title: 'Hanuman Chalisa',
    description: 'Devotional hymn to Lord Hanuman',
    duration: '8:20',
    url: 'https://example.com/hanuman-chalisa.mp3',
  },
  {
    id: '4',
    title: 'Om Shanti',
    description: 'Peace invocation',
    duration: '2:15',
    url: 'https://example.com/om-shanti.mp3',
  },
  {
    id: '5',
    title: 'Mahamrityunjaya Mantra',
    description: 'Healing mantra for protection',
    duration: '4:10',
    url: 'https://example.com/mahamrityunjaya.mp3',
  },
];

export const MantraPlayer: React.FC<MantraPlayerProps> = ({ onMantraComplete }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMantra, setCurrentMantra] = useState<Mantra | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolume] = useState(1.0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadMantra = async (mantra: Mantra) => {
    try {
      setIsLoading(true);
      
      // Stop current sound if playing
      if (sound) {
        await sound.unloadAsync();
      }

      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: mantra.url },
        { shouldPlay: false, isLooping: false, volume }
      );

      setSound(newSound);
      setCurrentMantra(mantra);
      setPosition(0);
      setDuration(0);

      // Set up status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);
        }
      });

    } catch (error) {
      console.error('Error loading mantra:', error);
      Alert.alert('Error', 'Failed to load mantra. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
      Alert.alert('Error', 'Failed to play mantra. Please try again.');
    }
  };

  const stop = async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      setPosition(0);
    } catch (error) {
      console.error('Error stopping:', error);
    }
  };

  const toggleLoop = async () => {
    if (!sound) return;

    try {
      const newLooping = !isLooping;
      await sound.setIsLoopingAsync(newLooping);
      setIsLooping(newLooping);
    } catch (error) {
      console.error('Error toggling loop:', error);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderMantraItem = (mantra: Mantra) => (
    <TouchableOpacity
      key={mantra.id}
      style={[
        styles.mantraItem,
        currentMantra?.id === mantra.id && styles.currentMantraItem,
      ]}
      onPress={() => loadMantra(mantra)}
      disabled={isLoading}
    >
      <View style={styles.mantraInfo}>
        <Text style={styles.mantraTitle}>{mantra.title}</Text>
        <Text style={styles.mantraDescription}>{mantra.description}</Text>
        <Text style={styles.mantraDuration}>{mantra.duration}</Text>
      </View>
      <View style={styles.mantraActions}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => {
            // TODO: Implement favorite functionality
            console.log('Toggle favorite:', mantra.title);
          }}
        >
          <Ionicons
            name={mantra.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={mantra.isFavorite ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Player Controls */}
      {currentMantra && (
        <View style={styles.playerContainer}>
          <LinearGradient
            colors={[colors.cardBackground, colors.background]}
            style={styles.playerGradient}
          >
            <View style={styles.playerHeader}>
              <Text style={styles.currentMantraTitle}>{currentMantra.title}</Text>
              <Text style={styles.currentMantraDescription}>
                {currentMantra.description}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: duration > 0 ? `${(position / duration) * 100}%` : '0%',
                    },
                  ]}
                />
              </View>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={stop}
                disabled={!sound}
              >
                <Ionicons name="stop" size={24} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playButton, isLoading && styles.playButtonDisabled]}
                onPress={playPause}
                disabled={!sound || isLoading}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color={colors.secondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isLooping && styles.controlButtonActive,
                ]}
                onPress={toggleLoop}
                disabled={!sound}
              >
                <Ionicons
                  name="repeat"
                  size={24}
                  color={isLooping ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Volume Control */}
            <View style={styles.volumeContainer}>
              <Ionicons name="volume-low" size={20} color={colors.textSecondary} />
              <View style={styles.volumeBar}>
                <View
                  style={[
                    styles.volumeFill,
                    { width: `${volume * 100}%` },
                  ]}
                />
              </View>
              <Ionicons name="volume-high" size={20} color={colors.textSecondary} />
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Mantra List */}
      <View style={styles.mantraListContainer}>
        <Text style={styles.mantraListTitle}>Sacred Mantras</Text>
        <ScrollView style={styles.mantraList} showsVerticalScrollIndicator={false}>
          {MANTRA_LIST.map(renderMantraItem)}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  playerContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  playerGradient: {
    padding: 20,
  },
  playerHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentMantraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  currentMantraDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    ...shadows.small,
  },
  controlButtonActive: {
    backgroundColor: colors.cardBackground,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    ...shadows.medium,
  },
  playButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginHorizontal: 12,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  mantraListContainer: {
    flex: 1,
  },
  mantraListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  mantraList: {
    flex: 1,
  },
  mantraItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  currentMantraItem: {
    backgroundColor: colors.primary,
  },
  mantraInfo: {
    flex: 1,
  },
  mantraTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  mantraDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mantraDuration: {
    fontSize: 12,
    color: colors.textLight,
  },
  mantraActions: {
    marginLeft: 12,
  },
  favoriteButton: {
    padding: 8,
  },
});

export default MantraPlayer;
