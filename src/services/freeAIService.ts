import { getEnvVar } from '../config/env';

const sanitizeContent = (text: string, prompt?: string): string => {
  if (typeof text !== 'string') {
    return '';
  }

  let sanitized = text.replace(/\r/g, '').replace(/\\"/g, '"').trim();

  if (prompt) {
    const stripped = sanitized.replace(prompt, '').trim();
    sanitized = stripped || sanitized;
  }

  if (!sanitized) {
    sanitized = text.trim();
  }

  return sanitized;
};

export interface AIResponse {
  content: string;
  type: 'jyotish' | 'spiritual_quote' | 'shloka' | 'mantra_interpretation' | 'general';
  confidence: number;
  timestamp: string;
  provider: 'huggingface' | 'cohere' | 'anthropic' | 'mock';
}

export interface SpiritualQuote {
  quote: string;
  author: string;
  category: 'daily_inspiration' | 'wisdom' | 'motivation' | 'peace' | 'love' | 'gratitude';
  language: string;
}

export interface ShlokaGeneration {
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
  deity: string;
  category: 'prayer' | 'meditation' | 'protection' | 'blessing' | 'gratitude';
}

export class FreeAIService {
  private static providers = {
    huggingface: {
      name: 'Hugging Face',
      baseUrl: 'https://api-inference.huggingface.co/models',
      apiKey: getEnvVar('huggingfaceApiKey'),
      freeTier: true,
      monthlyLimit: 1000,
      costPerRequest: 0
    },
    cohere: {
      name: 'Cohere',
      baseUrl: 'https://api.cohere.ai/v1',
      apiKey: getEnvVar('cohereApiKey'),
      freeTier: true,
      monthlyLimit: 1000,
      costPerRequest: 0
    },
    anthropic: {
      name: 'Anthropic Claude',
      baseUrl: 'https://api.anthropic.com/v1',
      apiKey: getEnvVar('anthropicApiKey'),
      freeTier: false,
      monthlyLimit: 0,
      costPerRequest: 0.0001
    }
  };

  private static currentProvider = this.providers.huggingface;

  /**
   * Generate AI Jyotish response using free AI providers
   */
  public static async generateJyotishResponse(
    question: string,
    userProfile: any
  ): Promise<AIResponse> {
    try {
      // Try Hugging Face first (free)
      if (this.providers.huggingface.apiKey) {
        const response = await this.generateWithHuggingFace(question, 'jyotish');
        if (response) {
          this.currentProvider = this.providers.huggingface;
          return response;
        }
      }

      // Try Cohere (free tier)
      if (this.providers.cohere.apiKey) {
        const response = await this.generateWithCohere(question, 'jyotish');
        if (response) {
          this.currentProvider = this.providers.cohere;
          return response;
        }
      }

      // Try Anthropic Claude (paid but cost-effective)
      if (this.providers.anthropic.apiKey) {
        const response = await this.generateWithAnthropic(question, 'jyotish');
        if (response) {
          this.currentProvider = this.providers.anthropic;
          return response;
        }
      }

      // Fallback to mock response
      return this.getMockJyotishResponse(question);
    } catch (error) {
      console.error('Error generating Jyotish response:', error);
      return this.getMockJyotishResponse(question);
    }
  }

  /**
   * Generate spiritual quote using free AI providers
   */
  public static async generateSpiritualQuote(
    category: string = 'daily_inspiration',
    userProfile?: any
  ): Promise<SpiritualQuote> {
    try {
      const prompt = `Generate a spiritual quote for the category: ${category}. Make it inspiring and relevant to daily life.`;

      // Try Hugging Face first
      if (this.providers.huggingface.apiKey) {
        const response = await this.generateWithHuggingFace(prompt, 'quote');
        if (response) {
          return this.parseQuoteResponse(response.content, category);
        }
      }

      // Try Cohere
      if (this.providers.cohere.apiKey) {
        const response = await this.generateWithCohere(prompt, 'quote');
        if (response) {
          return this.parseQuoteResponse(response.content, category);
        }
      }

      // Fallback to mock quote
      return this.getMockQuote(category);
    } catch (error) {
      console.error('Error generating spiritual quote:', error);
      return this.getMockQuote(category);
    }
  }

  /**
   * Generate Sanskrit shloka using free AI providers
   */
  public static async generateShloka(
    emotion: string,
    userProfile?: any
  ): Promise<ShlokaGeneration> {
    try {
      const prompt = `Generate a Sanskrit shloka for someone feeling: ${emotion}. Include transliteration, translation, and spiritual meaning.`;

      // Try Anthropic Claude (best for structured output)
      if (this.providers.anthropic.apiKey) {
        const response = await this.generateWithAnthropic(prompt, 'shloka');
        if (response) {
          return this.parseShlokaResponse(response.content, emotion);
        }
      }

      // Try Cohere
      if (this.providers.cohere.apiKey) {
        const response = await this.generateWithCohere(prompt, 'shloka');
        if (response) {
          return this.parseShlokaResponse(response.content, emotion);
        }
      }

      // Fallback to mock shloka
      return this.getMockShloka(emotion);
    } catch (error) {
      console.error('Error generating shloka:', error);
      return this.getMockShloka(emotion);
    }
  }

  /**
   * Generate mantra interpretation using free AI providers
   */
  public static async generateMantraInterpretation(
    mantra: string,
    userProfile?: any
  ): Promise<AIResponse> {
    try {
      const prompt = `Provide a detailed interpretation of the mantra: "${mantra}". Include its meaning, benefits, and how to use it.`;

      // Try Hugging Face first
      if (this.providers.huggingface.apiKey) {
        const response = await this.generateWithHuggingFace(prompt, 'mantra_interpretation');
        if (response) {
          return this.parseGeneratedResponse(response, prompt, 'mantra_interpretation');
        }
      }

      // Try Cohere
      if (this.providers.cohere.apiKey) {
        const response = await this.generateWithCohere(prompt, 'mantra_interpretation');
        if (response) {
          return this.parseGeneratedResponse(response, prompt, 'mantra_interpretation');
        }
      }

      // Fallback to mock response
      return this.getMockMantraInterpretation();
    } catch (error) {
      console.error('Error generating mantra interpretation:', error);
      return this.getMockMantraInterpretation();
    }
  }

  /**
   * Generate daily spiritual guidance using free AI providers
   */
  public static async generateDailyGuidance(userProfile: any): Promise<AIResponse> {
    try {
      const prompt = `Generate personalized daily spiritual guidance for today. Consider the user's deity preference: ${userProfile.deityPreference}.`;

      // Try Cohere (good for general guidance)
      if (this.providers.cohere.apiKey) {
        const response = await this.generateWithCohere(prompt, 'general');
        if (response) {
          return this.parseGeneratedResponse(response, prompt, 'general');
        }
      }

      // Try Hugging Face
      if (this.providers.huggingface.apiKey) {
        const response = await this.generateWithHuggingFace(prompt, 'general');
        if (response) {
          return this.parseGeneratedResponse(response, prompt, 'general');
        }
      }

      // Fallback to mock response
      return this.getMockDailyGuidance();
    } catch (error) {
      console.error('Error generating daily guidance:', error);
      return this.getMockDailyGuidance();
    }
  }

  private static async generateWithHuggingFace(prompt: string, type: string): Promise<AIResponse | null> {
    try {
      const model = this.getHuggingFaceModel(type);
      const response = await fetch(`${this.providers.huggingface.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.huggingface.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Hugging Face API request failed');
      }

      const data = await response.json();
      const content = Array.isArray(data) ? data[0]?.generated_text || data[0]?.text || prompt : data.generated_text || data.text || prompt;
      const sanitizedContent = sanitizeContent(content, prompt);

      if (!sanitizedContent || sanitizedContent === prompt.trim()) {
        if (type === 'mantra_interpretation' || type === 'general') {
          return {
            content: sanitizedContent ?? '',
            type: type as any,
            confidence: 0.8,
            timestamp: new Date().toISOString(),
            provider: 'huggingface'
          };
        }
        return null;
      }

      return {
        content: sanitizedContent,
        type: type as any,
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        provider: 'huggingface'
      };
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      return null;
    }
  }

  private static async generateWithCohere(prompt: string, type: string): Promise<AIResponse | null> {
    try {
      const response = await fetch(`${this.providers.cohere.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.cohere.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.7,
          stop_sequences: ['\n\n']
        }),
      });

      if (!response.ok) {
        throw new Error('Cohere API request failed');
      }

      const data = await response.json();
      const content = data.generations?.[0]?.text || prompt;
      const sanitizedContent = sanitizeContent(content, prompt);

      if (!sanitizedContent || sanitizedContent === prompt.trim()) {
        if (type === 'mantra_interpretation' || type === 'general') {
          return {
            content: sanitizedContent ?? '',
            type: type as any,
            confidence: 0.9,
            timestamp: new Date().toISOString(),
            provider: 'cohere'
          };
        }
        return null;
      }

      return {
        content: sanitizedContent,
        type: type as any,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        provider: 'cohere'
      };
    } catch (error) {
      console.error('Cohere API Error:', error);
      return null;
    }
  }

  private static async generateWithAnthropic(prompt: string, type: string): Promise<AIResponse | null> {
    try {
      const response = await fetch(`${this.providers.anthropic.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.providers.anthropic.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Anthropic API request failed');
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || prompt;
      const sanitizedContent = sanitizeContent(content, prompt);

      if (!sanitizedContent || sanitizedContent === prompt.trim()) {
        return null;
      }

      return {
        content: sanitizedContent,
        type: type as any,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
        provider: 'anthropic'
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      return null;
    }
  }

  private static getHuggingFaceModel(type: string): string {
    const models = {
      jyotish: 'microsoft/DialoGPT-medium',
      quote: 'gpt2',
      shloka: 'microsoft/DialoGPT-medium',
      mantra_interpretation: 'gpt2',
      general: 'microsoft/DialoGPT-medium'
    };
    return models[type as keyof typeof models] || 'gpt2';
  }

  private static parseQuoteResponse(content: string, category: string): SpiritualQuote {
    const sanitized = sanitizeContent(content);
    const lines = sanitized.split('\n').map(line => line.trim()).filter(Boolean);
    let quote = lines[0] || sanitized;
    let author = lines[1];

    const inlineMatch = quote.match(/^(["?']?)(.*?)["?']?(?:\s*[-?]\s*(.*))?$/);
    if (inlineMatch) {
      quote = inlineMatch[2] || quote;
      if (!author && inlineMatch[3]) {
        author = inlineMatch[3];
      }
    }

    quote = quote.replace(/^["?']/, '').replace(/["?']$/, '').trim();
    author = (author || 'Spiritual Wisdom').replace(/^[-\s"?']*/, '').replace(/["?']$/, '').trim();

    if ((!author || author.length === 0) && quote.includes(' - ')) {
      const parts = quote.split(' - ');
      if (parts.length > 1) {
        quote = parts[0];
        author = parts.slice(1).join(' - ');
      }
    }

    quote = quote.replace(/^["'??]+/, '').replace(/["'??]+$/, '').trim();
    author = (author || 'Spiritual Wisdom').replace(/^["'??]+/, '').replace(/["'??]+$/, '').trim();

    return {
      quote: quote.trim(),
      author: author.trim(),
      category: category as any,
      language: 'english'
    };
  }

  private static parseGeneratedResponse(response: AIResponse, prompt: string, type: AIResponse['type']): AIResponse {
    const sanitized = sanitizeContent(response.content, prompt);
    const trimmedPrompt = prompt.trim();

    if (sanitized && sanitized !== trimmedPrompt) {
      return {
        ...response,
        content: sanitized,
        type,
        timestamp: response.timestamp || new Date().toISOString(),
      };
    }

    switch (type) {
      case 'mantra_interpretation':
        return {
          ...response,
          content: this.getDefaultGeneratedContent(type),
          type,
          timestamp: response.timestamp || new Date().toISOString(),
        };
      case 'general':
        return {
          ...response,
          content: this.getDefaultGeneratedContent(type),
          type,
          timestamp: response.timestamp || new Date().toISOString(),
        };
      default:
        return {
          content: '',
          type,
          confidence: response.confidence ?? 0.5,
          timestamp: new Date().toISOString(),
          provider: 'mock'
        };
    }
  }

  private static parseShlokaResponse(content: string, emotion: string): ShlokaGeneration {
    const lines = content.split('\n').filter(line => line.trim());
    
    let sanskrit = '';
    let transliteration = '';
    let translation = '';
    let meaning = '';
    let deity = 'Universal Divine';
    let category = 'prayer';

    for (const line of lines) {
      if (line.startsWith('Sanskrit:')) {
        sanskrit = line.replace('Sanskrit:', '').trim();
      } else if (line.startsWith('Transliteration:')) {
        transliteration = line.replace('Transliteration:', '').trim();
      } else if (line.startsWith('Translation:')) {
        translation = line.replace('Translation:', '').trim();
      } else if (line.startsWith('Meaning:')) {
        meaning = line.replace('Meaning:', '').trim();
      } else if (line.startsWith('Deity:')) {
        deity = line.replace('Deity:', '').trim();
      } else if (line.startsWith('Category:')) {
        category = line.replace('Category:', '').trim().toLowerCase();
      }
    }

    // Fallback if parsing fails
    if (!sanskrit) {
      return this.getMockShloka(emotion);
    }

    return {
      sanskrit,
      transliteration,
      translation,
      meaning,
      deity,
      category: category as any
    };
  }

  private static getMockJyotishResponse(question: string): AIResponse {
    const responses = [
      'The stars align in your favor today. Trust your intuition and follow your heart.',
      'A period of transformation awaits you. Embrace change with courage and wisdom.',
      'Your spiritual journey is progressing beautifully. Continue on your path with faith.',
      'The universe is sending you positive energy. Stay open to new opportunities.',
      'Your inner light is shining brightly. Share your wisdom with others.'
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      type: 'jyotish',
      confidence: 0.7,
      timestamp: new Date().toISOString(),
      provider: 'mock'
    };
  }

  private static getMockMantraInterpretation(): AIResponse {
    return {
      content: 'This mantra carries deep spiritual significance and should be chanted with devotion and understanding.',
      type: 'mantra_interpretation',
      confidence: 0.5,
      timestamp: new Date().toISOString(),
      provider: 'mock'
    };
  }

  private static getMockDailyGuidance(): AIResponse {
    return {
      content: 'May your day be filled with peace, love, and spiritual growth.',
      type: 'general',
      confidence: 0.5,
      timestamp: new Date().toISOString(),
      provider: 'mock'
    };
  }

  private static getDefaultGeneratedContent(type: 'mantra_interpretation' | 'general'): string {
    if (type === 'mantra_interpretation') {
      return 'This mantra carries deep spiritual significance and should be chanted with devotion and understanding.';
    }

    return 'May your day be filled with peace, love, and spiritual growth.';
  }

  private static getMockQuote(category: string): SpiritualQuote {
    const quotes = {
      daily_inspiration: {
        quote: 'The divine light within you is always shining. Trust in its guidance.',
        author: 'Spiritual Wisdom'
      },
      wisdom: {
        quote: 'True wisdom comes from understanding that we are all connected.',
        author: 'Ancient Teaching'
      },
      motivation: {
        quote: 'Every step on the spiritual path brings you closer to your true self.',
        author: 'Mystic Sage'
      },
      peace: {
        quote: 'Peace is not the absence of chaos, but the presence of inner calm.',
        author: 'Zen Master'
      },
      love: {
        quote: 'Love is the highest vibration in the universe. Emit it freely.',
        author: 'Divine Love'
      },
      gratitude: {
        quote: 'Gratitude transforms what we have into enough.',
        author: 'Grateful Heart'
      }
    };

    const data = quotes[category as keyof typeof quotes] || quotes.daily_inspiration;
    
    return {
      quote: data.quote,
      author: data.author,
      category: category as any,
      language: 'english'
    };
  }

  private static getMockShloka(emotion: string): ShlokaGeneration {
    const fallbackShlokas = {
      peace: {
        sanskrit: '\u0936\u093e\u0928\u094d\u0924\u093f \u0936\u093e\u0928\u094d\u0924\u093f \u0936\u093e\u0928\u094d\u0924\u093f',
        transliteration: '\u015b\u0101nti \u015b\u0101nti \u015b\u0101nti',
        translation: 'Peace, peace, peace',
        meaning: 'A simple invocation for peace in mind, body, and spirit',
        deity: 'Universal Divine',
        category: 'meditation'
      },
      happiness: {
        sanskrit: '\u0938\u0941\u0916\u0902 \u092d\u0935\u0924\u0941',
        transliteration: 'sukha\u1e41 bhavatu',
        translation: 'May there be happiness',
        meaning: 'A blessing for joy and contentment in all aspects of life',
        deity: 'Universal Divine',
        category: 'blessing'
      },
      strength: {
        sanskrit: '\u092c\u0932\u0902 \u092d\u0935\u0924\u0941',
        transliteration: 'bala\u1e41 bhavatu',
        translation: 'May there be strength',
        meaning: 'An invocation for inner and outer strength to face life\'s challenges',
        deity: 'Universal Divine',
        category: 'prayer'
      }
    };

    const shloka = fallbackShlokas[emotion.toLowerCase() as keyof typeof fallbackShlokas] || fallbackShlokas.peace;
    
    return {
      sanskrit: shloka.sanskrit,
      transliteration: shloka.transliteration,
      translation: shloka.translation,
      meaning: shloka.meaning,
      deity: shloka.deity,
      category: shloka.category as any
    };
  }

  /**
   * Get current provider info
   */
  public static getCurrentProvider(): any {
    return this.currentProvider;
  }

  /**
   * Switch to a different provider
   */
  public static switchProvider(providerName: string): boolean {
    const provider = this.providers[providerName as keyof typeof this.providers];
    if (provider) {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }

  /**
   * Get provider status
   */
  public static getProviderStatus(): any {
    return {
      huggingface: {
        available: !!this.providers.huggingface.apiKey,
        freeTier: this.providers.huggingface.freeTier,
        monthlyLimit: this.providers.huggingface.monthlyLimit
      },
      cohere: {
        available: !!this.providers.cohere.apiKey,
        freeTier: this.providers.cohere.freeTier,
        monthlyLimit: this.providers.cohere.monthlyLimit
      },
      anthropic: {
        available: !!this.providers.anthropic.apiKey,
        freeTier: this.providers.anthropic.freeTier,
        monthlyLimit: this.providers.anthropic.monthlyLimit
      }
    };
  }
}
