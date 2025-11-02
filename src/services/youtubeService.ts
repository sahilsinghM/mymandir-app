/**
 * YouTube Service
 * Fetches devotional content from YouTube API
 */

import { env } from '../config/env';
import { DevotionalContent } from '../types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Search for devotional content on YouTube
 */
export const searchDevotionalContent = async (
  query: string,
  maxResults: number = 20
): Promise<DevotionalContent[]> => {
  try {
    const apiKey = env.youtube.apiKey;
    
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
      console.warn('YouTube API key not configured, returning fallback content');
      return getFallbackContent();
    }

    const searchQuery = encodeURIComponent(`${query} devotional spiritual`);
    const url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&type=video&key=${apiKey}&videoCategoryId=10`; // Music category

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return getFallbackContent();
    }

    // Get video details for duration
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
    
    let videoDetails: any = {};
    try {
      const detailsResponse = await fetch(detailsUrl);
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        detailsData.items?.forEach((item: any) => {
          videoDetails[item.id] = parseDuration(item.contentDetails.duration);
        });
      }
    } catch (error) {
      console.warn('Error fetching video details:', error);
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      videoId: item.id.videoId,
      category: categorizeContent(item.snippet.title, item.snippet.description),
      channelTitle: item.snippet.channelTitle,
      duration: videoDetails[item.id.videoId] || undefined,
    }));
  } catch (error) {
    console.error('Error fetching YouTube content:', error);
    return getFallbackContent();
  }
};

/**
 * Parse YouTube duration (PT4M13S format) to readable format
 */
const parseDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  if (minutes) {
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }
  return `0:${seconds.padStart(2, '0')}`;
};

/**
 * Categorize content based on title and description
 */
const categorizeContent = (
  title: string,
  description: string
): DevotionalContent['category'] => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('mantra') || text.includes('chant')) {
    return 'mantra';
  }
  if (text.includes('bhajan') || text.includes('song')) {
    return 'bhajan';
  }
  if (text.includes('kirtan') || text.includes('kirtan')) {
    return 'kirtan';
  }
  if (text.includes('lecture') || text.includes('discourse') || text.includes('katha')) {
    return 'lecture';
  }
  if (text.includes('meditation') || text.includes('dhyana')) {
    return 'meditation';
  }
  if (text.includes('prayer') || text.includes('aarti') || text.includes('arati')) {
    return 'prayer';
  }
  
  return 'mantra'; // Default
};

/**
 * Get popular devotional content by category
 */
export const getDevotionalByCategory = async (
  category: DevotionalContent['category'],
  maxResults: number = 20
): Promise<DevotionalContent[]> => {
  const categoryQueries: Record<DevotionalContent['category'], string> = {
    mantra: 'Om Namah Shivaya Gayatri Mantra',
    bhajan: 'Krishna Bhajan Hindi',
    kirtan: 'Hare Krishna Kirtan',
    lecture: 'Bhagavad Gita Lecture',
    meditation: 'Om Meditation',
    prayer: 'Aarti Prayer Hindu',
  };

  const query = categoryQueries[category] || categoryQueries.mantra;
  return searchDevotionalContent(query, maxResults);
};

/**
 * Get trending devotional content
 */
export const getTrendingDevotional = async (
  maxResults: number = 20
): Promise<DevotionalContent[]> => {
  return searchDevotionalContent('spiritual devotional', maxResults);
};

/**
 * Fallback content when API is unavailable
 */
const getFallbackContent = (): DevotionalContent[] => {
  return [
    {
      id: 'fallback-1',
      title: 'Om Namah Shivaya - Powerful Mantra',
      thumbnailUrl: 'https://via.placeholder.com/320x180?text=Om+Mantra',
      videoId: 'dQw4w9WgXcQ', // Placeholder
      category: 'mantra',
      channelTitle: 'Spiritual Wisdom',
      duration: '10:00',
    },
    {
      id: 'fallback-2',
      title: 'Gayatri Mantra - Ancient Chant',
      thumbnailUrl: 'https://via.placeholder.com/320x180?text=Gayatri+Mantra',
      videoId: 'dQw4w9WgXcQ',
      category: 'mantra',
      channelTitle: 'Devotional',
      duration: '15:30',
    },
    {
      id: 'fallback-3',
      title: 'Hare Krishna Maha Mantra',
      thumbnailUrl: 'https://via.placeholder.com/320x180?text=Kirtan',
      videoId: 'dQw4w9WgXcQ',
      category: 'kirtan',
      channelTitle: 'Spiritual Journey',
      duration: '20:00',
    },
    {
      id: 'fallback-4',
      title: 'Bhagavad Gita - Daily Wisdom',
      thumbnailUrl: 'https://via.placeholder.com/320x180?text=Lecture',
      videoId: 'dQw4w9WgXcQ',
      category: 'lecture',
      channelTitle: 'Wisdom Talks',
      duration: '30:00',
    },
  ];
};

