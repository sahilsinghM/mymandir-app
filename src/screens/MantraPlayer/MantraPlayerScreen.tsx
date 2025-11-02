import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { MantraPlayer } from '../../components/mantra/MantraPlayer';
import { Mantra } from '../../types';
import { getAllMantras, getFavoriteMantras, toggleFavorite } from '../../services/mantraService';

export const MantraPlayerScreen: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null);

  useEffect(() => {
    loadMantras();
  }, [showFavorites]);

  const loadMantras = async () => {
    try {
      setLoading(true);
      const data = showFavorites ? await getFavoriteMantras() : await getAllMantras();
      setMantras(data);
    } catch (error) {
      console.error('Error loading mantras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (mantraId: string, isFavorite: boolean) => {
    await toggleFavorite(mantraId);
    // Reload mantras to update favorite status
    loadMantras();
  };

  const handleMantraSelect = (mantra: Mantra) => {
    setSelectedMantra(mantra);
  };

  const renderMantraItem = ({ item }: { item: Mantra }) => (
    <View style={styles.mantraItem}>
      <ThemedCard style={styles.mantraCard}>
        <View style={styles.mantraHeader}>
          <View style={styles.mantraInfo}>
            <ThemedText variant="h4" style={styles.mantraTitle}>
              {item.title}
            </ThemedText>
            {item.duration && (
              <ThemedText variant="caption" color="textSecondary">
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </ThemedText>
            )}
          </View>
          <ThemedButton
            title={selectedMantra?.id === item.id ? 'Now Playing' : 'Play'}
            variant={selectedMantra?.id === item.id ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleMantraSelect(item)}
          />
        </View>
      </ThemedCard>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
          Loading mantras...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h1" style={styles.headerTitle}>
          Mantra Player
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.headerSubtitle}>
          Listen to devotional mantras and spiritual music
        </ThemedText>
      </View>

      <View style={styles.filterContainer}>
        <ThemedButton
          title="All Mantras"
          variant={!showFavorites ? 'primary' : 'outline'}
          size="sm"
          onPress={() => setShowFavorites(false)}
          style={styles.filterButton}
        />
        <ThemedButton
          title="Favorites"
          variant={showFavorites ? 'primary' : 'outline'}
          size="sm"
          onPress={() => setShowFavorites(true)}
          style={styles.filterButton}
        />
      </View>

      {selectedMantra && (
        <MantraPlayer
          mantra={selectedMantra}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      <FlatList
        data={mantras}
        renderItem={renderMantraItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText variant="body" color="textSecondary" style={styles.emptyText}>
              {showFavorites
                ? 'No favorite mantras yet. Add some to your favorites!'
                : 'No mantras available.'}
            </ThemedText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    marginTop: theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterButton: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  mantraItem: {
    marginBottom: theme.spacing.md,
  },
  mantraCard: {
    padding: theme.spacing.md,
  },
  mantraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mantraInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  mantraTitle: {
    marginBottom: theme.spacing.xs,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

