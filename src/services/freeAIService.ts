/**
 * Free AI Service
 * Provides AI-powered content generation using free/open-source alternatives
 * Falls back between multiple services for reliability
 */

import { env } from '../config/env';
import { generateText as openAIGenerateText } from './openaiService';

/**
 * Generate text using free AI services with fallback
 */
export const generateText = async (
  prompt: string,
  systemPrompt?: string
): Promise<string> => {
  // Try OpenAI first (if configured)
  try {
    if (env.openai.apiKey && env.openai.apiKey !== 'your_openai_api_key_here') {
      return await openAIGenerateText(prompt, systemPrompt);
    }
  } catch (error) {
    console.log('OpenAI not available, trying fallback services');
  }

  // Try Hugging Face Inference API
  try {
    const hfApiKey = env.ai.huggingfaceApiKey;
    if (hfApiKey && hfApiKey !== 'your_huggingface_api_key_here') {
      return await generateWithHuggingFace(prompt, systemPrompt);
    }
  } catch (error) {
    console.log('Hugging Face not available, trying next fallback');
  }

  // Fallback to simple rule-based responses
  return generateFallbackResponse(prompt, systemPrompt);
};

/**
 * Generate using Hugging Face Inference API
 */
const generateWithHuggingFace = async (
  prompt: string,
  systemPrompt?: string
): Promise<string> => {
  try {
    const apiKey = env.ai.huggingfaceApiKey;
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    // Using a text generation model (you can change the model)
    const model = 'gpt2'; // Free model, you can use other models
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.replace(fullPrompt, '').trim();
    }

    if (data[0]?.generated_text) {
      return data[0].generated_text.replace(fullPrompt, '').trim();
    }

    throw new Error('Unexpected response format from Hugging Face');
  } catch (error: any) {
    console.error('Error calling Hugging Face API:', error);
    throw error;
  }
};

/**
 * Generate fallback response when no AI services are available
 */
const generateFallbackResponse = (
  prompt: string,
  systemPrompt?: string
): string => {
  const lowerPrompt = prompt.toLowerCase();

  // Simple rule-based responses for common queries
  if (lowerPrompt.includes('shloka') || lowerPrompt.includes('verse')) {
    if (lowerPrompt.includes('peace') || lowerPrompt.includes('calm')) {
      return `ॐ शान्ति शान्ति शान्ति

Om Shanti Shanti Shanti

May peace prevail in the three worlds - physical, mental, and spiritual. This ancient invocation calls for peace in body, mind, and soul.`;
    }
    if (lowerPrompt.includes('strength') || lowerPrompt.includes('courage')) {
      return `शक्ति और साहस के लिए:

"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"

Perform your duty without attachment to results. True strength comes from acting with dedication and without expectation.`;
    }
    if (lowerPrompt.includes('happiness') || lowerPrompt.includes('joy')) {
      return `सुख और आनंद के लिए:

"सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ"

Treat happiness and sorrow, gain and loss, victory and defeat with equanimity. Inner joy comes from balance.`;
    }
    return `Here is a verse for your spiritual journey:

"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"

May all beings be happy and free from illness. May all experience auspiciousness. This verse promotes universal well-being and compassion.`;
  }

  if (lowerPrompt.includes('horoscope') || lowerPrompt.includes('astrology')) {
    return `Based on Vedic astrology principles:
- Your spiritual journey is influenced by planetary positions
- Daily practices like meditation and mantra chanting can help align with positive energies
- Consider consulting a qualified Jyotish for detailed analysis

For personalized guidance, please provide more specific questions about your birth chart or current concerns.`;
  }

  // Generic fallback
  return `Thank you for your question. For the best spiritual guidance:
- Practice daily meditation and mindfulness
- Read sacred texts like the Bhagavad Gita
- Consult with experienced spiritual teachers
- Trust in the divine timing of your journey

May your path be filled with peace and enlightenment. 🙏`;
};

/**
 * Generate a shloka using free AI services
 */
export const generateShloka = async (
  emotion: string,
  situation?: string
): Promise<{ verse: string; translation: string; meaning: string }> => {
  const systemPrompt = `You are a knowledgeable Sanskrit scholar. Generate authentic Sanskrit shlokas with translations. Format as JSON: {verse, translation, meaning}.`;

  const prompt = `Generate a Sanskrit shloka for emotion: ${emotion}${
    situation ? `, situation: ${situation}` : ''
  }`;

  try {
    const response = await generateText(prompt, systemPrompt);
    
    // Try to parse JSON
    try {
      const parsed = JSON.parse(response);
      return {
        verse: parsed.verse || response,
        translation: parsed.translation || '',
        meaning: parsed.meaning || '',
      };
    } catch {
      // Fallback structure
      const lines = response.split('\n').filter((l) => l.trim());
      return {
        verse: lines[0] || getFallbackShloka(emotion).verse,
        translation: lines[1] || getFallbackShloka(emotion).translation,
        meaning: lines.slice(2).join('\n') || getFallbackShloka(emotion).meaning,
      };
    }
  } catch (error: any) {
    // Return fallback shloka
    return getFallbackShloka(emotion);
  }
};

/**
 * Get fallback shloka based on emotion
 */
const getFallbackShloka = (
  emotion: string
): { verse: string; translation: string; meaning: string } => {
  const lowerEmotion = emotion.toLowerCase();

  if (lowerEmotion.includes('peace') || lowerEmotion.includes('calm')) {
    return {
      verse: 'ॐ शान्ति शान्ति शान्ति',
      translation: 'Om Shanti Shanti Shanti',
      meaning: 'May peace prevail in the three worlds - physical, mental, and spiritual. This invocation brings tranquility to all aspects of existence.',
    };
  }

  if (lowerEmotion.includes('strength') || lowerEmotion.includes('courage')) {
    return {
      verse: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      translation: 'Karmanye vadhikaraste ma phaleshu kadachana',
      meaning: 'You have the right to perform your duty, but you are not entitled to the fruits of your actions. Focus on effort, not outcomes.',
    };
  }

  if (lowerEmotion.includes('happiness') || lowerEmotion.includes('joy')) {
    return {
      verse: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः',
      translation: 'Sarve bhavantu sukhinah sarve santu niraamayah',
      meaning: 'May all beings be happy and free from illness. May all experience auspiciousness and well-being.',
    };
  }

  // Default shloka
  return {
    verse: 'ॐ असतो मा सद्गमय',
    translation: 'Om Asato Ma Sadgamaya',
    meaning: 'Lead me from the unreal to the real, from darkness to light, from mortality to immortality. This verse seeks truth and enlightenment.',
  };
};

/**
 * Get AI Jyotish response using free services
 */
export const getAIJyotishResponse = async (
  userQuery: string,
  context?: string
): Promise<string> => {
  const systemPrompt = `You are an AI Jyotish assistant with knowledge of Vedic astrology. Provide helpful spiritual guidance.`;

  const prompt = context ? `Context: ${context}\n\nQuestion: ${userQuery}` : userQuery;

  try {
    return await generateText(prompt, systemPrompt);
  } catch (error: any) {
    return generateFallbackResponse(prompt, systemPrompt);
  }
};

