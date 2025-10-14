import { GeetaAPI } from '../../services/geetaApi';

// Mock fetch
global.fetch = jest.fn();

describe('GeetaAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch random verse', async () => {
    const mockResponse = {
      verse: 'Test verse',
      translation: 'Test translation',
      chapter: 1,
      verseNumber: 1,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await GeetaAPI.getRandomVerse();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('https://bhagavadgita.io/api/v1/random');
  });

  it('should fetch verse by chapter and verse number', async () => {
    const mockResponse = {
      verse: 'Test verse',
      translation: 'Test translation',
      chapter: 2,
      verseNumber: 3,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await GeetaAPI.getVerse(2, 3);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('https://bhagavadgita.io/api/v1/chapter/2/verse/3');
  });

  it('should handle API errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    await expect(GeetaAPI.getRandomVerse()).rejects.toThrow('API Error');
  });
});
