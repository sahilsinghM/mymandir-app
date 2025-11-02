import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { DevotionalContent } from '../../types';
import {
  searchDevotionalContent,
  getDevotionalByCategory,
  getTrendingDevotional,
} from '../../services/youtubeService';

const categories: Array<{ key: DevotionalContent['category']; label: string }> = [
  { key: 'mantra', label: 'Mantras' },
  { key: 'bhajan', label: 'Bhajans' },
  { key: 'kirtan', label: 'Kirtan' },
  { key: 'lecture', label: 'Lectures' },
  { key: 'meditation', label: 'Meditation' },
  { key: 'prayer', label: 'Prayers' },
];

export const TempleFeedScreen: React.FC = () => {
  const [content, setContent] = useState<DevotionalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DevotionalContent['category'] | 'all'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let data: DevotionalContent[];

      if (selectedCategory === 'all') {
        data = await getTrendingDevotional();
      } else {
        data = await getDevotionalByCategory(selectedCategory);
      }

      setContent(data);
    } catch (error) {
      console.error('Error loading devotional content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadContent();
      return;
    }

    try {
      setLoading(true);
      const data = await searchDevotionalContent(searchQuery);
      setContent(data);
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.openURL(url).catch((err) =>
      console.error('Error opening YouTube:', err)
    );
  };

  const renderContentItem = ({ item }: { item: DevotionalContent }) => (
    <ThemedCard style={styles.contentCard}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openVideo(item.videoId)}
      >
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.contentInfo}>
          <ThemedText variant="body" weight="semiBold" numberOfLines={2} style={styles.title}>
            {item.title}
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary" style={styles.channel}>
            {item.channelTitle}
          </ThemedText>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <ThemedText variant="caption" color="primary" weight="semiBold">
                {categories.find((c) => c.key === item.category)?.label || item.category}
              </ThemedText>
            </View>
            {item.duration && (
              <ThemedText variant="caption" color="textSecondary">
                {item.duration}
              </ThemedText>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </ThemedCard>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h1" style={styles.headerTitle}>
          Virtual Darshan
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.headerSubtitle}>
          Discover spiritual content and devotional experiences
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === 'all' && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <ThemedText
            variant="caption"
            weight={selectedCategory === 'all' ? 'semiBold' : 'normal'}
            color={selectedCategory === 'all' ? 'textInverse' : 'textSecondary'}
          >
            All
          </ThemedText>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <ThemedText
              variant="caption"
              weight={selectedCategory === category.key ? 'semiBold' : 'normal'}
              color={selectedCategory === category.key ? 'textInverse' : 'textSecondary'}
            >
              {category.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
            Loading devotional content...
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={content}
          renderItem={renderContentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText variant="body" color="textSecondary">
                No content found. Try another category or search.
              </ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  categoryScroll: {
    maxHeight: 60,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  contentCard: {
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.border,
  },
  contentInfo: {
    padding: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  channel: {
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.spacing.xs,
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
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
});

