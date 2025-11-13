/**
 * Unified AI Service
 * Manages multiple AI providers (OpenAI, DeepSeek, etc.) with model switching and performance tracking
 */

import { env } from '../config/env';
import { generateText as openAIGenerateText, getAIJyotishResponse as openAIGetResponse } from './openaiService';
import { generateText as deepSeekGenerateText, getAIJyotishResponse as deepSeekGetResponse, AIResponse } from './deepseekService';
import { FreeAIService } from './freeAIService';

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

  // Check OpenAI (Priority model)
  const openaiAvailable =
    env.openai.apiKey &&
    env.openai.apiKey !== 'your_openai_api_key_here' &&
    env.openai.apiKey !== '' &&
    env.openai.apiKey.trim().length > 0;
  
  if (openaiAvailable) {
    models.push({
      id: 'openai',
      name: 'OpenAI (Primary)',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
      available: true,
    });
  }

  // Check DeepSeek (Backup)
  const deepseekAvailable =
    env.deepseek.apiKey &&
    env.deepseek.apiKey !== 'your_deepseek_api_key_here' &&
    env.deepseek.apiKey !== '' &&
    env.deepseek.apiKey.trim().length > 0;
  
  if (deepseekAvailable) {
    models.push({
      id: 'deepseek',
      name: 'DeepSeek (Backup)',
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

const buildFreePrompt = (prompt: string, systemPrompt?: string) =>
  systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

const generateWithFreeAI = async (prompt: string, systemPrompt?: string): Promise<string> => {
  const response = await FreeAIService.generateJyotishResponse(
    buildFreePrompt(prompt, systemPrompt),
    undefined
  );
  return response.content;
};

const getFreeAIResponse = async (userQuery: string, context?: string): Promise<AIResponse> => {
  const startTime = Date.now();
  const response = await FreeAIService.generateJyotishResponse(
    context ? `Context: ${context}\n\nQuestion: ${userQuery}` : userQuery,
    undefined
  );

  return {
    content: response.content,
    model: response.provider || 'free-ai',
    responseTime: Date.now() - startTime,
  };
};

/**
 * Generate text using specified AI model with automatic fallback
 * Priority: OpenAI → DeepSeek → Free AI
 */
export const generateWithModel = async (
  prompt: string,
  systemPrompt?: string,
  model: AIModel = 'openai',
  specificModel?: string
): Promise<AIResponse> => {
  const startTime = Date.now();

  // Try OpenAI first (if requested or as default), then DeepSeek, then Free AI
  if (model === 'openai') {
    try {
      const openaiResponse = await openAIGenerateText(prompt, systemPrompt);
      return {
        content: openaiResponse,
        model: specificModel || 'gpt-3.5-turbo',
        responseTime: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error('OpenAI failed, trying DeepSeek fallback:', error.message);
      // Fallback to DeepSeek
      try {
        return await deepSeekGenerateText(
          prompt,
          systemPrompt,
          (specificModel as DeepSeekModel) || 'deepseek-chat'
        );
      } catch (deepseekError: any) {
        console.error('DeepSeek also failed, using Free AI fallback:', deepseekError.message);
        // Fallback to Free AI
        const freeResponse = await generateWithFreeAI(prompt, systemPrompt);
        return {
          content: freeResponse,
          model: 'free-ai-fallback',
          responseTime: Date.now() - startTime,
        };
      }
    }
  }

  if (model === 'deepseek') {
    try {
      return await deepSeekGenerateText(
        prompt,
        systemPrompt,
        (specificModel as DeepSeekModel) || 'deepseek-chat'
      );
    } catch (error: any) {
      console.error('DeepSeek failed, using Free AI fallback:', error.message);
      const freeResponse = await generateWithFreeAI(prompt, systemPrompt);
      return {
        content: freeResponse,
        model: 'free-ai-fallback',
        responseTime: Date.now() - startTime,
      };
    }
  }

  // Free AI or default
  const freeResponse = await generateWithFreeAI(prompt, systemPrompt);
  return {
    content: freeResponse,
    model: 'free-ai',
    responseTime: Date.now() - startTime,
  };
};

/**
 * Get AI Jyotish response using specified model with automatic fallback
 * Priority: OpenAI → DeepSeek → Free AI
 */
export const getAIJyotishResponse = async (
  userQuery: string,
  context: string = '',
  model: AIModel = 'openai',
  specificModel?: string
): Promise<AIResponse> => {
  const prompt = context ? `Context: ${context}\n\nQuestion: ${userQuery}` : userQuery;
  const startTime = Date.now();

  // If explicitly requesting a model, use it with fallback
  if (model === 'openai') {
    try {
      const openaiResponse = await openAIGetResponse(userQuery, context);
      return {
        content: openaiResponse,
        model: specificModel || 'gpt-3.5-turbo',
        responseTime: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error('OpenAI failed, trying DeepSeek fallback:', error.message);
      // Fallback to DeepSeek
      try {
        return await deepSeekGetResponse(
          userQuery,
          context,
          (specificModel as DeepSeekModel) || 'deepseek-chat'
        );
      } catch (deepseekError: any) {
        console.error('DeepSeek also failed, using Free AI fallback:', deepseekError.message);
        // Fallback to Free AI
        return getFreeAIResponse(userQuery, context);
      }
    }
  }

  if (model === 'deepseek') {
    try {
      return await deepSeekGetResponse(
        userQuery,
        context,
        (specificModel as DeepSeekModel) || 'deepseek-chat'
      );
    } catch (error: any) {
      console.error('DeepSeek failed, using Free AI fallback:', error.message);
      return getFreeAIResponse(userQuery, context);
    }
  }

  // Free AI or default
  return getFreeAIResponse(userQuery, context);
};

/**
 * Test multiple models with the same query (for performance comparison)
 */
export const testModels = async (
  prompt: string,
  systemPrompt?: string,
  models: AIModel[] = ['openai', 'deepseek', 'free']
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
