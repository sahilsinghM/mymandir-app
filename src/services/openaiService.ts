import { getEnvVar } from '../config/env';

export interface UserProfile {
  deityPreference?: string;
  language?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  zodiacSign?: string;
  currentMood?: string;
  spiritualGoals?: string[];
}

export interface AIResponse {
  content: string;
  type: 'jyotish' | 'spiritual_quote' | 'shloka' | 'mantra_interpretation' | 'general';
  confidence: number;
  timestamp: string;
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

export class OpenAIService {
  private static API_URL = 'https://api.openai.com/v1/chat/completions';
  private static MODEL = 'gpt-4'; // Use GPT-4 for better responses
  private static FALLBACK_MODEL = 'gpt-3.5-turbo'; // Fallback for cost optimization

  private static getApiKey(): string {
    return getEnvVar('openaiApiKey');
  }

  private static async makeRequest(
    messages: any[], 
    model: string = this.MODEL,
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key is not set.');
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  /**
   * Generate AI Jyotish response
   */
  public static async generateJyotishResponse(
    question: string, 
    userProfile: UserProfile
  ): Promise<AIResponse> {
    const systemPrompt = this.getJyotishSystemPrompt(userProfile);
    const userPrompt = this.formatJyotishQuestion(question, userProfile);

    try {
      const response = await this.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], this.MODEL, 0.8, 1500);

      return {
        content: response,
        type: 'jyotish',
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating Jyotish response:', error);
      return {
        content: 'I apologize, but I am unable to provide an astrological reading at this time. Please try again later.',
        type: 'jyotish',
        confidence: 0.1,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate spiritual quote
   */
  public static async generateSpiritualQuote(
    category: string = 'daily_inspiration',
    userProfile?: UserProfile
  ): Promise<SpiritualQuote> {
    const systemPrompt = this.getQuoteSystemPrompt(userProfile);
    const userPrompt = `Generate a spiritual quote for the category: ${category}. Make it inspiring and relevant to daily life.`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], this.FALLBACK_MODEL, 0.9, 200);

      const lines = response.split('\n').filter(line => line.trim());
      const quote = lines[0]?.replace(/^["']|["']$/g, '') || response;
      const author = lines[1]?.replace(/^- /, '') || 'Ancient Wisdom';

      return {
        quote: quote.trim(),
        author: author.trim(),
        category: category as any,
        language: userProfile?.language || 'english'
      };
    } catch (error) {
      console.error('Error generating spiritual quote:', error);
      return {
        quote: 'The divine light within you is always shining. Trust in its guidance.',
        author: 'Spiritual Wisdom',
        category: 'daily_inspiration',
        language: 'english'
      };
    }
  }

  /**
   * Generate Sanskrit shloka based on emotion
   */
  public static async generateShloka(
    emotion: string,
    userProfile?: UserProfile
  ): Promise<ShlokaGeneration> {
    const systemPrompt = this.getShlokaSystemPrompt(userProfile);
    const userPrompt = `Generate a Sanskrit shloka for someone feeling: ${emotion}. Include transliteration, translation, and spiritual meaning.`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], this.MODEL, 0.8, 800);

      return this.parseShlokaResponse(response, emotion);
    } catch (error) {
      console.error('Error generating shloka:', error);
      return this.getFallbackShloka(emotion);
    }
  }

  /**
   * Generate mantra interpretation
   */
  public static async generateMantraInterpretation(
    mantra: string,
    userProfile?: UserProfile
  ): Promise<AIResponse> {
    const systemPrompt = this.getMantraSystemPrompt(userProfile);
    const userPrompt = `Provide a detailed interpretation of the mantra: "${mantra}". Include its meaning, benefits, and how to use it.`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], this.MODEL, 0.7, 1000);

      return {
        content: response,
        type: 'mantra_interpretation',
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating mantra interpretation:', error);
      return {
        content: 'This mantra carries deep spiritual significance and should be chanted with devotion and understanding.',
        type: 'mantra_interpretation',
        confidence: 0.5,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate daily spiritual guidance
   */
  public static async generateDailyGuidance(
    userProfile: UserProfile
  ): Promise<AIResponse> {
    const systemPrompt = this.getDailyGuidanceSystemPrompt(userProfile);
    const userPrompt = `Generate personalized daily spiritual guidance for today. Consider the user's deity preference: ${userProfile.deityPreference}.`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], this.MODEL, 0.8, 1200);

      return {
        content: response,
        type: 'general',
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating daily guidance:', error);
      return {
        content: 'May your day be filled with peace, love, and spiritual growth.',
        type: 'general',
        confidence: 0.5,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get quick prompts for AI Jyotish
   */
  public static getQuickPrompts(): string[] {
    return [
      'What does my future hold?',
      'How can I improve my relationships?',
      'What career path should I follow?',
      'How can I find inner peace?',
      'What challenges will I face this month?',
      'How can I strengthen my spiritual practice?',
      'What does my birth chart reveal?',
      'How can I overcome my fears?',
      'What is my life purpose?',
      'How can I attract positive energy?'
    ];
  }

  private static getJyotishSystemPrompt(userProfile: UserProfile): string {
    const deity = userProfile.deityPreference || 'Universal Divine';
    const language = userProfile.language || 'English';
    
    return `You are an expert Vedic astrologer and spiritual guide with deep knowledge of Hindu astrology, Vedic wisdom, and spiritual practices. 

User Profile:
- Deity Preference: ${deity}
- Language: ${language}
- Zodiac Sign: ${userProfile.zodiacSign || 'Not specified'}

Guidelines:
1. Provide accurate astrological insights based on Vedic principles
2. Combine traditional wisdom with practical, modern advice
3. Always maintain a positive, encouraging tone
4. Include specific guidance for spiritual growth
5. Reference the user's deity preference when relevant
6. Provide actionable advice, not just predictions
7. Respect the sacred nature of astrology and spirituality
8. If uncertain about specific details, provide general guidance
9. Always end with a blessing or positive affirmation
10. Keep responses concise but meaningful (150-300 words)

Remember: You are helping someone on their spiritual journey. Be compassionate, wise, and inspiring.`;
  }

  private static getQuoteSystemPrompt(userProfile?: UserProfile): string {
    const deity = userProfile?.deityPreference || 'Universal Divine';
    
    return `You are a wise spiritual teacher who creates inspiring quotes that resonate with people's hearts and souls.

Guidelines:
1. Create quotes that are uplifting and spiritually meaningful
2. Draw inspiration from ${deity} and Hindu spiritual traditions
3. Make quotes practical and applicable to daily life
4. Keep quotes concise (1-2 sentences)
5. Use simple, beautiful language
6. Avoid clichés - be original and profound
7. Include a brief author attribution (e.g., "Ancient Wisdom", "Vedic Teaching", "Spiritual Master")

Format your response as:
"Quote text here"
- Author Name`;
  }

  private static getShlokaSystemPrompt(userProfile?: UserProfile): string {
    const deity = userProfile?.deityPreference || 'Universal Divine';
    
    return `You are a Sanskrit scholar and spiritual teacher who creates authentic Sanskrit shlokas for different emotional states and spiritual needs.

Guidelines:
1. Create authentic Sanskrit shlokas (not just translations)
2. Include proper transliteration using IAST format
3. Provide accurate English translation
4. Include spiritual meaning and context
5. Make shlokas relevant to the user's emotional state
6. Draw inspiration from ${deity} and Hindu traditions
7. Ensure shlokas are grammatically correct in Sanskrit
8. Keep shlokas concise (2-4 lines)

Format your response as:
Sanskrit: [Sanskrit text]
Transliteration: [IAST transliteration]
Translation: [English translation]
Meaning: [Spiritual meaning and context]
Deity: [Relevant deity]
Category: [prayer/meditation/protection/blessing/gratitude]`;
  }

  private static getMantraSystemPrompt(userProfile?: UserProfile): string {
    const deity = userProfile?.deityPreference || 'Universal Divine';
    
    return `You are an expert in Vedic mantras and their spiritual significance. Provide detailed interpretations of mantras.

Guidelines:
1. Explain the literal meaning of the mantra
2. Describe its spiritual significance and benefits
3. Explain how to properly chant the mantra
4. Mention the deity or energy associated with the mantra
5. Provide practical guidance for daily practice
6. Include any specific benefits for different aspects of life
7. Reference ${deity} when relevant
8. Keep the explanation accessible and practical`;
  }

  private static getDailyGuidanceSystemPrompt(userProfile: UserProfile): string {
    const deity = userProfile.deityPreference || 'Universal Divine';
    const language = userProfile.language || 'English';
    
    return `You are a spiritual guide providing daily guidance to help someone on their spiritual journey.

User Profile:
- Deity Preference: ${deity}
- Language: ${language}
- Spiritual Goals: ${userProfile.spiritualGoals?.join(', ') || 'General spiritual growth'}

Guidelines:
1. Provide personalized daily spiritual guidance
2. Include a specific practice or reflection for the day
3. Reference ${deity} and their teachings when appropriate
4. Make guidance practical and actionable
5. Include a daily affirmation or prayer
6. Keep the tone warm, encouraging, and wise
7. Address common spiritual challenges
8. Provide guidance that can be implemented throughout the day
9. End with a blessing or positive intention`;
  }

  private static formatJyotishQuestion(question: string, userProfile: UserProfile): string {
    let formattedQuestion = question;
    
    if (userProfile.zodiacSign) {
      formattedQuestion += `\n\nMy zodiac sign is ${userProfile.zodiacSign}.`;
    }
    
    if (userProfile.currentMood) {
      formattedQuestion += `\n\nI'm currently feeling ${userProfile.currentMood}.`;
    }
    
    if (userProfile.spiritualGoals && userProfile.spiritualGoals.length > 0) {
      formattedQuestion += `\n\nMy spiritual goals include: ${userProfile.spiritualGoals.join(', ')}.`;
    }
    
    return formattedQuestion;
  }

  private static parseShlokaResponse(response: string, emotion: string): ShlokaGeneration {
    const lines = response.split('\n').filter(line => line.trim());
    
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
      return this.getFallbackShloka(emotion);
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

  private static getFallbackShloka(emotion: string): ShlokaGeneration {
    const fallbackShlokas = {
      peace: {
        sanskrit: 'शान्ति शान्ति शान्ति',
        transliteration: 'śānti śānti śānti',
        translation: 'Peace, peace, peace',
        meaning: 'A simple invocation for peace in mind, body, and spirit',
        deity: 'Universal Divine',
        category: 'meditation'
      },
      happiness: {
        sanskrit: 'सुखं भवतु',
        transliteration: 'sukhaṁ bhavatu',
        translation: 'May there be happiness',
        meaning: 'A blessing for joy and contentment in all aspects of life',
        deity: 'Universal Divine',
        category: 'blessing'
      },
      strength: {
        sanskrit: 'बलं भवतु',
        transliteration: 'balaṁ bhavatu',
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
}