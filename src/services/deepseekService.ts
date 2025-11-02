/**
 * DeepSeek Service
 * Provides AI-powered content generation using DeepSeek API
 */

import { env } from '../config/env';

const DEEPSEEK_API_BASE = 'https://api.deepseek.com/v1';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
  };
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  responseTime: number;
}

/**
 * Generate text using DeepSeek API
 */
export const generateText = async (
  prompt: string,
  systemPrompt?: string,
  model: string = 'deepseek-chat'
): Promise<AIResponse> => {
  const startTime = Date.now();
  
  try {
    const apiKey = env.deepseek.apiKey;

    if (!apiKey || apiKey === 'your_deepseek_api_key_here' || apiKey === '') {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `DeepSeek API error: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    const responseTime = Date.now() - startTime;

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      content: data.choices[0]?.message?.content || 'No response generated',
      model: model,
      usage: data.usage,
      responseTime,
    };
  } catch (error: any) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};

/**
 * Get AI Jyotish response using DeepSeek
 */
export const getAIJyotishResponse = async (
  userQuery: string,
  context?: string,
  model: string = 'deepseek-chat'
): Promise<AIResponse> => {
  const systemPrompt = `You are an AI Jyotish (astrologer) assistant with deep knowledge of Vedic astrology, planetary positions, and spiritual guidance. 
Provide helpful, accurate, and compassionate responses about horoscopes, planetary influences, and spiritual matters.
Keep responses concise and practical.`;

  const prompt = context
    ? `Context: ${context}\n\nQuestion: ${userQuery}`
    : userQuery;

  return generateText(prompt, systemPrompt, model);
};

