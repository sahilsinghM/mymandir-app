import { getEnvVar } from '../config/env';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  category: 'mantra' | 'bhajan' | 'kirtan' | 'lecture' | 'meditation' | 'prayer';
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  channelTitle: string;
  videos: YouTubeVideo[];
}

export class YouTubeService {
  private static API_URL = 'https://www.googleapis.com/youtube/v3';
  private static MAX_RESULTS = 50;

  private static getApiKey(): string {
    return getEnvVar('youtubeApiKey');
  }

  private static async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('YouTube API key is not set.');
    }

    const queryParams = new URLSearchParams({
      key: apiKey,
      part: 'snippet,contentDetails,statistics',
      ...params,
    });

    try {
      const response = await fetch(`${this.API_URL}${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'YouTube API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw error;
    }
  }

  /**
   * Search for devotional content by category
   */
  public static async searchDevotionalContent(
    category: YouTubeVideo['category'],
    maxResults: number = 20
  ): Promise<YouTubeVideo[]> {
    try {
      const searchTerms = this.getSearchTerms(category);
      const query = searchTerms.join(' OR ');

      const response = await this.makeRequest('/search', {
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music category
        maxResults: maxResults.toString(),
        order: 'relevance',
        safeSearch: 'moderate',
      });

      return this.formatVideos(response.items || []);
    } catch (error) {
      console.error('Error searching devotional content:', error);
      throw error;
    }
  }

  /**
   * Get popular devotional playlists
   */
  public static async getDevotionalPlaylists(maxResults: number = 10): Promise<YouTubePlaylist[]> {
    try {
      const searchTerms = [
        'hindu devotional songs',
        'bhakti geet',
        'mantra chanting',
        'spiritual music',
        'bhajan collection',
        'kirtan playlist'
      ];

      const playlists: YouTubePlaylist[] = [];

      for (const term of searchTerms) {
        const response = await this.makeRequest('/search', {
          q: term,
          type: 'playlist',
          maxResults: '5',
          order: 'relevance',
        });

        const formattedPlaylists = await this.formatPlaylists(response.items || []);
        playlists.push(...formattedPlaylists);
      }

      return playlists.slice(0, maxResults);
    } catch (error) {
      console.error('Error getting devotional playlists:', error);
      throw error;
    }
  }

  /**
   * Get videos from a specific playlist
   */
  public static async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    try {
      const response = await this.makeRequest('/playlistItems', {
        playlistId,
        maxResults: '50',
      });

      const videoIds = response.items?.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      if (!videoIds) return [];

      const videoResponse = await this.makeRequest('/videos', {
        id: videoIds,
        maxResults: '50',
      });

      return this.formatVideos(videoResponse.items || []);
    } catch (error) {
      console.error('Error getting playlist videos:', error);
      throw error;
    }
  }

  /**
   * Get trending devotional content
   */
  public static async getTrendingDevotional(maxResults: number = 20): Promise<YouTubeVideo[]> {
    try {
      const response = await this.makeRequest('/videos', {
        chart: 'mostPopular',
        videoCategoryId: '10', // Music category
        regionCode: 'IN', // India region for devotional content
        maxResults: maxResults.toString(),
      });

      // Filter for devotional content
      const devotionalVideos = response.items?.filter((video: any) => 
        this.isDevotionalContent(video.snippet.title, video.snippet.description)
      ) || [];

      return this.formatVideos(devotionalVideos);
    } catch (error) {
      console.error('Error getting trending devotional content:', error);
      throw error;
    }
  }

  /**
   * Search for specific mantras or prayers
   */
  public static async searchMantras(mantraName: string, maxResults: number = 15): Promise<YouTubeVideo[]> {
    try {
      const searchTerms = [
        `${mantraName} mantra`,
        `${mantraName} chanting`,
        `${mantraName} prayer`,
        `${mantraName} bhajan`
      ];

      const allVideos: YouTubeVideo[] = [];

      for (const term of searchTerms) {
        const response = await this.makeRequest('/search', {
          q: term,
          type: 'video',
          videoCategoryId: '10',
          maxResults: '10',
          order: 'relevance',
        });

        const videos = this.formatVideos(response.items || []);
        allVideos.push(...videos);
      }

      // Remove duplicates and return top results
      const uniqueVideos = this.removeDuplicateVideos(allVideos);
      return uniqueVideos.slice(0, maxResults);
    } catch (error) {
      console.error('Error searching mantras:', error);
      throw error;
    }
  }

  /**
   * Get channel information for devotional channels
   */
  public static async getDevotionalChannels(): Promise<any[]> {
    try {
      const channelIds = [
        'UC8uU_wuBMxieLD2TtELH8gQ', // T-Series Bhakti Sagar
        'UCj8aE8ZKzCxT05X5rlWw2Xg', // Shemaroo Bhakti
        'UC7Lp7Zfz7uX5VoNsVqGxdoA', // Bhakti TV
        'UC8uU_wuBMxieLD2TtELH8gQ', // Spiritual India
      ];

      const response = await this.makeRequest('/channels', {
        id: channelIds.join(','),
        part: 'snippet,statistics',
      });

      return response.items?.map((channel: any) => ({
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high.url,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
      })) || [];
    } catch (error) {
      console.error('Error getting devotional channels:', error);
      throw error;
    }
  }

  private static getSearchTerms(category: YouTubeVideo['category']): string[] {
    const searchTermsMap = {
      mantra: [
        'om namah shivaya',
        'hare krishna',
        'om mani padme hum',
        'gayatri mantra',
        'mahamrityunjaya mantra',
        'hanuman chalisa',
        'shiva mantra',
        'vishnu mantra'
      ],
      bhajan: [
        'hindu bhajan',
        'devotional songs',
        'bhakti geet',
        'spiritual songs',
        'religious music',
        'hindu devotional'
      ],
      kirtan: [
        'kirtan',
        'satsang',
        'spiritual gathering',
        'devotional singing',
        'hindu kirtan'
      ],
      lecture: [
        'spiritual lecture',
        'hindu philosophy',
        'vedic knowledge',
        'spiritual discourse',
        'religious talk'
      ],
      meditation: [
        'meditation music',
        'spiritual meditation',
        'hindu meditation',
        'chakra meditation',
        'guided meditation'
      ],
      prayer: [
        'hindu prayer',
        'devotional prayer',
        'spiritual prayer',
        'religious prayer'
      ]
    };

    return searchTermsMap[category] || [];
  }

  private static formatVideos(items: any[]): YouTubeVideo[] {
    return items.map((item: any) => ({
      id: item.id || item.snippet?.resourceId?.videoId,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high?.url || '',
      duration: item.contentDetails?.duration || '',
      channelTitle: item.snippet?.channelTitle || '',
      publishedAt: item.snippet?.publishedAt || '',
      viewCount: item.statistics?.viewCount || '0',
      category: this.categorizeVideo(item.snippet?.title || '', item.snippet?.description || ''),
    }));
  }

  private static async formatPlaylists(items: any[]): Promise<YouTubePlaylist[]> {
    const playlists: YouTubePlaylist[] = [];

    for (const item of items) {
      try {
        const videos = await this.getPlaylistVideos(item.id.playlistId);
        playlists.push({
          id: item.id.playlistId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          itemCount: videos.length,
          channelTitle: item.snippet.channelTitle,
          videos: videos.slice(0, 10), // Limit to first 10 videos
        });
      } catch (error) {
        console.error('Error formatting playlist:', error);
      }
    }

    return playlists;
  }

  private static categorizeVideo(title: string, description: string): YouTubeVideo['category'] {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('mantra') || text.includes('chanting')) return 'mantra';
    if (text.includes('bhajan') || text.includes('devotional song')) return 'bhajan';
    if (text.includes('kirtan') || text.includes('satsang')) return 'kirtan';
    if (text.includes('lecture') || text.includes('discourse')) return 'lecture';
    if (text.includes('meditation') || text.includes('meditation music')) return 'meditation';
    if (text.includes('prayer') || text.includes('prayer song')) return 'prayer';
    
    return 'bhajan'; // Default category
  }

  private static isDevotionalContent(title: string, description: string): boolean {
    const text = (title + ' ' + description).toLowerCase();
    const devotionalKeywords = [
      'hindu', 'bhajan', 'kirtan', 'mantra', 'devotional', 'spiritual',
      'bhakti', 'prayer', 'religious', 'god', 'lord', 'shiva', 'vishnu',
      'krishna', 'ram', 'hanuman', 'durga', 'lakshmi', 'saraswati'
    ];
    
    return devotionalKeywords.some(keyword => text.includes(keyword));
  }

  private static removeDuplicateVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
    const seen = new Set();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }
}
