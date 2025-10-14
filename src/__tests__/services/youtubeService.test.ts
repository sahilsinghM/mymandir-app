import { YouTubeService } from '../../services/youtubeService';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
jest.mock('../../config/env', () => ({
  getEnvVar: jest.fn((key: string) => {
    if (key === 'youtubeApiKey') return 'test-youtube-api-key';
    return 'test-value';
  })
}));

describe('YouTubeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search devotional content', async () => {
    const mockResponse = {
      items: [
        {
          id: { videoId: 'test123' },
          snippet: {
            title: 'Test Devotional Song',
            description: 'A beautiful devotional song',
            thumbnails: { high: { url: 'test-thumbnail.jpg' } },
            channelTitle: 'Test Channel',
            publishedAt: '2023-01-01T00:00:00Z'
          },
          contentDetails: { duration: 'PT3M30S' },
          statistics: { viewCount: '1000' }
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const videos = await YouTubeService.searchDevotionalContent('bhajan', 5);
    
    expect(videos).toHaveLength(1);
    expect(videos[0].title).toBe('Test Devotional Song');
    expect(videos[0].category).toBe('bhajan');
  });

  it('should get devotional playlists', async () => {
    const mockResponse = {
      items: [
        {
          id: { playlistId: 'playlist123' },
          snippet: {
            title: 'Test Playlist',
            description: 'A collection of devotional songs',
            thumbnails: { high: { url: 'test-thumbnail.jpg' } },
            channelTitle: 'Test Channel'
          }
        }
      ]
    };

    const mockVideoResponse = {
      items: [
        {
          id: 'video123',
          snippet: {
            title: 'Test Video',
            description: 'A devotional video',
            thumbnails: { high: { url: 'test-thumbnail.jpg' } },
            channelTitle: 'Test Channel',
            publishedAt: '2023-01-01T00:00:00Z'
          },
          contentDetails: { duration: 'PT3M30S' },
          statistics: { viewCount: '1000' }
        }
      ]
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVideoResponse)
      });

    const playlists = await YouTubeService.getDevotionalPlaylists(5);
    
    expect(playlists).toHaveLength(1);
    expect(playlists[0].title).toBe('Test Playlist');
  });

  it('should search mantras', async () => {
    const mockResponse = {
      items: [
        {
          id: { videoId: 'mantra123' },
          snippet: {
            title: 'Om Namah Shivaya Mantra',
            description: 'Powerful Shiva mantra chanting',
            thumbnails: { high: { url: 'mantra-thumbnail.jpg' } },
            channelTitle: 'Spiritual Channel',
            publishedAt: '2023-01-01T00:00:00Z'
          },
          contentDetails: { duration: 'PT10M' },
          statistics: { viewCount: '5000' }
        }
      ]
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ items: [] })
      });

    const videos = await YouTubeService.searchMantras('Shiva', 5);
    
    expect(videos).toHaveLength(1);
    expect(videos[0].title).toBe('Om Namah Shivaya Mantra');
    expect(videos[0].category).toBe('mantra');
  });

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    await expect(YouTubeService.searchDevotionalContent('bhajan')).rejects.toThrow('API Error');
  });

  it('should handle missing API key', async () => {
    // Mock getEnvVar to return empty string for youtubeApiKey
    const { getEnvVar } = require('../../config/env');
    (getEnvVar as jest.Mock).mockReturnValueOnce('');

    await expect(YouTubeService.searchDevotionalContent('bhajan')).rejects.toThrow('YouTube API key is not set.');
  });
});
