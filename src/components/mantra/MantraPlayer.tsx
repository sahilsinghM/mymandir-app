import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard } from '../ui';
import { Mantra } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@mymandir:favorites';

interface MantraPlayerProps {
  mantra: Mantra;
  onFavoriteToggle?: (mantraId: string, isFavorite: boolean) => void;
}

export const MantraPlayer: React.FC<MantraPlayerProps> = ({
  mantra,
  onFavoriteToggle,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(mantra.duration || 0);
  const [isFavorite, setIsFavorite] = useState(mantra.isFavorite || false);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    loadFavoriteStatus();
    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [mantra.id]);

  const loadFavoriteStatus = async () => {
    try {
      const favorites = await getFavorites();
      setIsFavorite(favorites.includes(mantra.id));
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  const getFavorites = async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  };

  const saveFavorites = async (favorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        await loadAndPlay();
      }
    } catch (error) {
      console.error('Error playing/pausing:', error);
    }
  };

  const loadAndPlay = async () => {
    try {
      setIsLoading(true);
      
      // Request audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and load sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: mantra.audioUrl },
        {
          shouldPlay: true,
          isLooping: isLooping,
          volume: 1.0,
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
      
      // Get duration if available
      const status = await newSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setDuration(status.durationMillis / 1000);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handleStop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        setPosition(0);
      }
    } catch (error) {
      console.error('Error stopping:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const favorites = await getFavorites();
      const newFavoriteStatus = !isFavorite;
      
      if (newFavoriteStatus) {
        favorites.push(mantra.id);
      } else {
        const index = favorites.indexOf(mantra.id);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      }
      
      await saveFavorites(favorites);
      setIsFavorite(newFavoriteStatus);
      onFavoriteToggle?.(mantra.id, newFavoriteStatus);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleLoop = async () => {
    const newLooping = !isLooping;
    setIsLooping(newLooping);
    
    if (sound) {
      try {
        await sound.setIsLoopingAsync(newLooping);
      } catch (error) {
        console.error('Error setting loop:', error);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ThemedCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText variant="h3" style={styles.title}>
            {mantra.title}
          </ThemedText>
          {duration > 0 && (
            <ThemedText variant="caption" color="textSecondary">
              {formatTime(duration)}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <ThemedText variant="h3" color={isFavorite ? 'accent' : 'textLight'}>
            {isFavorite ? '★' : '☆'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={handleStop}
          style={styles.controlButton}
          disabled={!sound && !isPlaying}
        >
          <ThemedText variant="h4">⏹</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.controlButton, styles.playButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.textInverse} />
          ) : (
            <ThemedText variant="h2" color="textInverse">
              {isPlaying ? '⏸' : '▶'}
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleLoop}
          style={[
            styles.controlButton,
            isLooping && styles.loopButtonActive,
          ]}
        >
          <ThemedText variant="h4" color={isLooping ? 'primary' : 'textSecondary'}>
            🔁
          </ThemedText>
        </TouchableOpacity>
      </View>

      {duration > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <ThemedText variant="caption" color="textSecondary">
              {formatTime(position)}
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary">
              {formatTime(duration)}
            </ThemedText>
          </View>
        </View>
      )}
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
  },
  loopButtonActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

