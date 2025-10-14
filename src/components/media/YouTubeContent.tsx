import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { YouTubeService, YouTubeVideo, YouTubePlaylist } from '../../services/youtubeService';
import { WebView } from 'react-native-webview';

interface YouTubeContentProps {
  category?: 'mantra' | 'bhajan' | 'kirtan' | 'lecture' | 'meditation' | 'prayer';
  onVideoSelect?: (video: YouTubeVideo) => void;
}

const YouTubeContent: React.FC<YouTubeContentProps> = ({ 
  category = 'bhajan', 
  onVideoSelect 
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists'>('videos');

  useEffect(() => {
    loadContent();
  }, [category]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [videosData, playlistsData] = await Promise.all([
        YouTubeService.searchDevotionalContent(category, 20),
        YouTubeService.getDevotionalPlaylists(10)
      ]);
      setVideos(videosData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading YouTube content:', error);
      Alert.alert('Error', 'Failed to load devotional content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    onVideoSelect?.(video);
  };

  const formatDuration = (duration: string): string => {
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  const renderVideoItem = ({ item }: { item: YouTubeVideo }) => (
    <TouchableOpacity 
      style={styles.videoItem} 
      onPress={() => handleVideoPress(item)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.playButton}>
          <Ionicons name="play" size={24} color={colors.secondary} />
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.channelTitle}>{item.channelTitle}</Text>
        <View style={styles.videoStats}>
          <Text style={styles.viewCount}>{formatViewCount(item.viewCount)}</Text>
          <Text style={styles.publishedDate}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({ item }: { item: YouTubePlaylist }) => (
    <TouchableOpacity style={styles.playlistItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.playlistThumbnail} />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.playlistChannel}>{item.channelTitle}</Text>
        <Text style={styles.playlistCount}>{item.itemCount} videos</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    return (
      <View style={styles.videoPlayerContainer}>
        <LinearGradient
          colors={[colors.cardBackground, colors.background]}
          style={styles.videoPlayer}
        >
          <View style={styles.playerHeader}>
            <Text style={styles.playerTitle}>{selectedVideo.title}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedVideo(null)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <WebView
            style={styles.webView}
            source={{ 
              uri: `https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0` 
            }}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
          
          <View style={styles.playerInfo}>
            <Text style={styles.playerChannel}>{selectedVideo.channelTitle}</Text>
            <Text style={styles.playerDescription} numberOfLines={3}>
              {selectedVideo.description}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading devotional content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'videos' && styles.activeTabButton]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'videos' && styles.activeTabButtonText]}>
            Videos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'playlists' && styles.activeTabButton]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'playlists' && styles.activeTabButtonText]}>
            Playlists
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'videos' ? (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Video Player Modal */}
      {renderVideoPlayer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 4,
    ...shadows.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.secondary,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  videoItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  channelTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  viewCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  publishedDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  playlistItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...shadows.small,
  },
  playlistThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  playlistChannel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  videoPlayerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
  },
  videoPlayer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 16,
  },
  closeButton: {
    padding: 8,
  },
  webView: {
    height: 200,
  },
  playerInfo: {
    padding: 16,
  },
  playerChannel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  playerDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default YouTubeContent;
