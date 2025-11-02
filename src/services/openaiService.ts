/**
 * OpenAI Service
 * Provides AI-powered content generation using OpenAI API
 */

import { env } from '../config/env';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

/**
 * Generate text using OpenAI
 */
export const generateText = async (
  prompt: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    const apiKey = env.openai.apiKey;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...(systemPrompt
            ? [
                {
                  role: 'system',
                  content: systemPrompt,
                },
              ]
            : []),
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Generate a shloka based on emotion/situation
 */
export const generateShloka = async (
  emotion: string,
  situation?: string
): Promise<{ verse: string; translation: string; meaning: string }> => {
  const systemPrompt = `You are a knowledgeable Sanskrit scholar and spiritual guide. Generate authentic Sanskrit shlokas (verses) with their translations and meanings. 
Format your response as JSON with keys: verse, translation, meaning.
The verse should be in Devanagari script, appropriate for the given emotion or situation.`;

  const prompt = `Generate a Sanskrit shloka for someone feeling ${emotion}${
    situation ? ` in the situation: ${situation}` : ''
  }. Provide the verse in Devanagari script, English transliteration/translation, and a meaningful interpretation.`;

  try {
    const response = await generateText(prompt, systemPrompt);
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        verse: parsed.verse || response,
        translation: parsed.translation || '',
        meaning: parsed.meaning || '',
      };
    } catch {
      // If not JSON, try to extract structured content
      const lines = response.split('\n').filter((line) => line.trim());
      return {
        verse: lines[0] || response,
        translation: lines[1] || '',
        meaning: lines.slice(2).join('\n') || response,
      };
    }
  } catch (error: any) {
    throw new Error(`Failed to generate shloka: ${error.message}`);
  }
};

/**
 * Get AI Jyotish response
 */
export const getAIJyotishResponse = async (
  userQuery: string,
  context?: string
): Promise<string> => {
  const systemPrompt = `You are an AI Jyotish (astrologer) assistant with deep knowledge of Vedic astrology, planetary positions, and spiritual guidance. 
Provide helpful, accurate, and compassionate responses about horoscopes, planetary influences, and spiritual matters.
Keep responses concise and practical.`;

  const prompt = context
    ? `Context: ${context}\n\nQuestion: ${userQuery}`
    : userQuery;

  try {
    return await generateText(prompt, systemPrompt);
  } catch (error: any) {
    throw new Error(`Failed to get AI Jyotish response: ${error.message}`);
  }
};

