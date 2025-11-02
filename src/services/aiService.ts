/**
 * Unified AI Service
 * Manages multiple AI providers (OpenAI, DeepSeek, etc.) with model switching and performance tracking
 */

import { env } from '../config/env';
import { generateText as openAIGenerateText, getAIJyotishResponse as openAIGetResponse } from './openaiService';
import { generateText as deepSeekGenerateText, getAIJyotishResponse as deepSeekGetResponse, AIResponse } from './deepseekService';
import { generateText as freeAIGenerateText, getAIJyotishResponse as freeAIGetResponse } from './freeAIService';

export type AIModel = 'openai' | 'deepseek' | 'free';
export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo';
export type DeepSeekModel = 'deepseek-chat' | 'deepseek-coder';

export interface ModelConfig {
  id: AIModel;
  name: string;
  models?: string[];
  available: boolean;
}

export interface PerformanceMetrics {
  model: string;
  responseTime: number;
  tokensUsed?: number;
  timestamp: Date;
}

const JYOTISH_SYSTEM_PROMPT = `You are an AI Jyotish (astrologer) assistant with deep knowledge of Vedic astrology, planetary positions, and spiritual guidance. 
Provide helpful, accurate, and compassionate responses about horoscopes, planetary influences, and spiritual matters.
Keep responses concise and practical.`;

/**
 * Check which AI models are available
 */
export const getAvailableModels = (): ModelConfig[] => {
  const models: ModelConfig[] = [];

  // Check OpenAI
  const openaiAvailable =
    env.openai.apiKey &&
    env.openai.apiKey !== 'your_openai_api_key_here' &&
    env.openai.apiKey !== '';
  
  if (openaiAvailable) {
    models.push({
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
      available: true,
    });
  }

  // Check DeepSeek
  const deepseekAvailable =
    env.deepseek.apiKey &&
    env.deepseek.apiKey !== 'your_deepseek_api_key_here' &&
    env.deepseek.apiKey !== '';
  
  if (deepseekAvailable) {
    models.push({
      id: 'deepseek',
      name: 'DeepSeek',
      models: ['deepseek-chat', 'deepseek-coder'],
      available: true,
    });
  }

  // Free AI is always available as fallback
  models.push({
    id: 'free',
    name: 'Free AI (Fallback)',
    available: true,
  });

  return models;
};

/**
 * Generate text using specified AI model
 */
export const generateWithModel = async (
  prompt: string,
  systemPrompt?: string,
  model: AIModel = 'deepseek',
  specificModel?: string
): Promise<AIResponse> => {
  const startTime = Date.now();

  try {
    switch (model) {
      case 'openai':
        const openaiResponse = await openAIGenerateText(prompt, systemPrompt);
        return {
          content: openaiResponse,
          model: specificModel || 'gpt-3.5-turbo',
          responseTime: Date.now() - startTime,
        };
      
      case 'deepseek':
        return await deepSeekGenerateText(
          prompt,
          systemPrompt,
          (specificModel as DeepSeekModel) || 'deepseek-chat'
        );
      
      case 'free':
      default:
        const freeResponse = await freeAIGenerateText(prompt, systemPrompt);
        return {
          content: freeResponse,
          model: 'free-ai',
          responseTime: Date.now() - startTime,
        };
    }
  } catch (error: any) {
    console.error(`Error with ${model}:`, error);
    
    // Fallback to free AI if premium models fail
    if (model !== 'free') {
      console.log('Falling back to free AI');
      const freeResponse = await freeAIGenerateText(prompt, systemPrompt);
      return {
        content: freeResponse,
        model: 'free-ai-fallback',
        responseTime: Date.now() - startTime,
      };
    }
    
    throw error;
  }
};

/**
 * Get AI Jyotish response using specified model
 */
export const getAIJyotishResponse = async (
  userQuery: string,
  context: string = '',
  model: AIModel = 'deepseek',
  specificModel?: string
): Promise<AIResponse> => {
  const prompt = context ? `Context: ${context}\n\nQuestion: ${userQuery}` : userQuery;

  try {
    switch (model) {
      case 'openai':
        const openaiResponse = await openAIGetResponse(userQuery, context);
        return {
          content: openaiResponse,
          model: specificModel || 'gpt-3.5-turbo',
          responseTime: 0, // OpenAI service doesn't track time
        };
      
      case 'deepseek':
        return await deepSeekGetResponse(
          userQuery,
          context,
          (specificModel as DeepSeekModel) || 'deepseek-chat'
        );
      
      case 'free':
      default:
        const freeResponse = await freeAIGetResponse(userQuery, context);
        return {
          content: freeResponse,
          model: 'free-ai',
          responseTime: 0,
        };
    }
  } catch (error: any) {
    console.error(`Error with ${model} for Jyotish:`, error);
    
    // Fallback
    if (model !== 'free') {
      const freeResponse = await freeAIGetResponse(userQuery, context);
      return {
        content: freeResponse,
        model: 'free-ai-fallback',
        responseTime: 0,
      };
    }
    
    throw error;
  }
};

/**
 * Test multiple models with the same query (for performance comparison)
 */
export const testModels = async (
  prompt: string,
  systemPrompt?: string,
  models: AIModel[] = ['deepseek', 'openai', 'free']
): Promise<Record<AIModel, AIResponse | { error: string }>> => {
  const results: Record<string, AIResponse | { error: string }> = {};

  const promises = models.map(async (model) => {
    try {
      const response = await generateWithModel(prompt, systemPrompt, model);
      return { model, response };
    } catch (error: any) {
      return { model, response: { error: error.message } };
    }
  });

  const responses = await Promise.all(promises);
  
  responses.forEach(({ model, response }) => {
    results[model] = response;
  });

  return results as Record<AIModel, AIResponse | { error: string }>;
};

