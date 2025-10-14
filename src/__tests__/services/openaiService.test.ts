import { OpenAIService } from '../../services/openaiService';

// Mock fetch
global.fetch = jest.fn();

describe('OpenAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate AI Jyotish response', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'Based on your birth chart, this is a favorable time for career growth.'
        }
      }]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await OpenAIService.generateJyotishResponse('What does my future hold?', {
      deityPreference: 'Krishna',
      language: 'english',
      birthDate: '1990-01-01',
      birthTime: '10:00',
      birthPlace: 'Mumbai'
    });

    expect(result).toBe('Based on your birth chart, this is a favorable time for career growth.');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer')
        })
      })
    );
  });

  it('should generate spiritual quote', async () => {
    const mockResponse = {
      choices: [{
        message: {
          content: 'The divine light within you guides your path to enlightenment.'
        }
      }]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await OpenAIService.generateSpiritualQuote('Krishna', 'english');
    expect(result).toBe('The divine light within you guides your path to enlightenment.');
  });

  it('should handle API errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    await expect(OpenAIService.generateJyotishResponse('test', {})).rejects.toThrow('API Error');
  });
});
