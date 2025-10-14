import { FreeAIService } from '../../services/freeAIService';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
jest.mock('../../config/env', () => ({
  getEnvVar: jest.fn((key: string) => {
    if (key === 'huggingfaceApiKey') return 'test-huggingface-key';
    if (key === 'cohereApiKey') return 'test-cohere-key';
    if (key === 'anthropicApiKey') return 'test-anthropic-key';
    return 'test-value';
  })
}));

describe('FreeAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate Jyotish response with Hugging Face', async () => {
    const mockResponse = [
      {
        generated_text: 'The stars align in your favor today. Trust your intuition and follow your heart.'
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await FreeAIService.generateJyotishResponse('What does my future hold?', {});
    
    expect(response.content).toBe('The stars align in your favor today. Trust your intuition and follow your heart.');
    expect(response.type).toBe('jyotish');
    expect(response.provider).toBe('huggingface');
  });

  it('should generate Jyotish response with Cohere', async () => {
    // Mock Hugging Face to fail
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Hugging Face Error'));

    const mockResponse = {
      generations: [
        {
          text: 'A period of transformation awaits you. Embrace change with courage and wisdom.'
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await FreeAIService.generateJyotishResponse('What does my future hold?', {});
    
    expect(response.content).toBe('A period of transformation awaits you. Embrace change with courage and wisdom.');
    expect(response.type).toBe('jyotish');
    expect(response.provider).toBe('cohere');
  });

  it('should generate spiritual quote', async () => {
    const mockResponse = [
      {
        generated_text: '"The divine light within you is always shining. Trust in its guidance." - Spiritual Wisdom'
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const quote = await FreeAIService.generateSpiritualQuote('daily_inspiration');
    
    expect(quote.quote).toBe('The divine light within you is always shining. Trust in its guidance.');
    expect(quote.author).toBe('Spiritual Wisdom');
    expect(quote.category).toBe('daily_inspiration');
  });

  it('should generate shloka with Anthropic Claude', async () => {
    // Mock Hugging Face and Cohere to fail
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Hugging Face Error'))
      .mockRejectedValueOnce(new Error('Cohere Error'));

    const mockResponse = {
      content: [
        {
          text: 'Sanskrit: शान्ति शान्ति शान्ति\nTransliteration: śānti śānti śānti\nTranslation: Peace, peace, peace\nMeaning: A simple invocation for peace in mind, body, and spirit\nDeity: Universal Divine\nCategory: meditation'
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const shloka = await FreeAIService.generateShloka('peace');
    
    expect(shloka.sanskrit).toBe('शान्ति शान्ति शान्ति');
    expect(shloka.transliteration).toBe('śānti śānti śānti');
    expect(shloka.translation).toBe('Peace, peace, peace');
    expect(shloka.deity).toBe('Universal Divine');
  });

  it('should generate mantra interpretation', async () => {
    const mockResponse = [
      {
        generated_text: 'This mantra carries deep spiritual significance and should be chanted with devotion and understanding.'
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await FreeAIService.generateMantraInterpretation('Om Namah Shivaya');
    
    expect(response.content).toBe('This mantra carries deep spiritual significance and should be chanted with devotion and understanding.');
    expect(response.type).toBe('mantra_interpretation');
    expect(response.provider).toBe('huggingface');
  });

  it('should generate daily guidance', async () => {
    const mockResponse = {
      generations: [
        {
          text: 'May your day be filled with peace, love, and spiritual growth.'
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const response = await FreeAIService.generateDailyGuidance({ deityPreference: 'Krishna' });
    
    expect(response.content).toBe('May your day be filled with peace, love, and spiritual growth.');
    expect(response.type).toBe('general');
    expect(response.provider).toBe('cohere');
  });

  it('should handle API errors and return mock data', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const response = await FreeAIService.generateJyotishResponse('What does my future hold?', {});
    
    expect(response.content).toBeDefined();
    expect(response.provider).toBe('mock');
  });

  it('should get provider status', () => {
    const status = FreeAIService.getProviderStatus();
    
    expect(status.huggingface.available).toBe(true);
    expect(status.cohere.available).toBe(true);
    expect(status.anthropic.available).toBe(true);
  });

  it('should switch providers', () => {
    const result = FreeAIService.switchProvider('cohere');
    expect(result).toBe(true);
    
    const currentProvider = FreeAIService.getCurrentProvider();
    expect(currentProvider.name).toBe('Cohere');
  });

  it('should handle invalid provider switch', () => {
    const result = FreeAIService.switchProvider('invalid');
    expect(result).toBe(false);
  });
});
