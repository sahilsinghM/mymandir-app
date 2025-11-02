/**
 * Astrology Service
 * Provides basic horoscope and astrology data
 */

import { Horoscope, ZodiacSign } from '../types';

const AZTRO_API_BASE = 'https://aztro.sameerkumar.website';

/**
 * Get daily horoscope for a zodiac sign
 */
export const getDailyHoroscope = async (
  sign: ZodiacSign
): Promise<Horoscope> => {
  try {
    // Convert sign to lowercase for API
    const signLower = sign.toLowerCase();
    const url = `${AZTRO_API_BASE}/?sign=${signLower}&day=today`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.description) {
      throw new Error('Invalid response from API');
    }

    return {
      sign,
      date: data.current_date || new Date().toISOString().split('T')[0],
      prediction: data.description,
      type: 'daily',
    };
  } catch (error) {
    console.error('Error fetching daily horoscope:', error);
    // Return fallback horoscope
    return getFallbackHoroscope(sign);
  }
};

/**
 * Get weekly horoscope for a zodiac sign
 */
export const getWeeklyHoroscope = async (
  sign: ZodiacSign
): Promise<Horoscope> => {
  try {
    // Convert sign to lowercase for API
    const signLower = sign.toLowerCase();
    const url = `${AZTRO_API_BASE}/?sign=${signLower}&day=tomorrow`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.description) {
      throw new Error('Invalid response from API');
    }

    return {
      sign,
      date: data.current_date || new Date().toISOString().split('T')[0],
      prediction: data.description,
      type: 'weekly',
    };
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    return getFallbackHoroscope(sign);
  }
};

/**
 * Get monthly horoscope for a zodiac sign
 */
export const getMonthlyHoroscope = async (
  sign: ZodiacSign
): Promise<Horoscope> => {
  try {
    // AztroAPI doesn't have monthly, so we'll use weekly for now
    return getWeeklyHoroscope(sign);
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    return getFallbackHoroscope(sign);
  }
};

/**
 * Fallback horoscope when API fails
 */
const getFallbackHoroscope = (sign: ZodiacSign): Horoscope => {
  const predictions: Record<ZodiacSign, string> = {
    Aries: `Dear ${sign}, today the stars align to bring you clarity and purpose. Your natural leadership shines through, and opportunities await those bold enough to take them. Trust your instincts and move forward with confidence.`,
    Taurus: `For ${sign}, this is a time of stability and grounding. The universe supports your practical approach to life. Financial matters may improve, and relationships deepen. Stay patient and persistent in your endeavors.`,
    Gemini: `Communication flows easily for ${sign} today. Your curiosity and adaptability open new doors. Social connections bring joy, and intellectual pursuits are favored. Express your thoughts clearly and embrace new ideas.`,
    Cancer: `Emotional depth characterizes ${sign}'s day. Home and family matters take center stage. Your intuition is strong—trust it. Nurture your relationships and create a peaceful sanctuary around you.`,
    Leo: `Creative energy surges for ${sign}. Your natural charisma draws positive attention and opportunities. This is a day to express yourself boldly and pursue artistic or leadership endeavors. Confidence is your greatest asset.`,
    Virgo: `Attention to detail serves ${sign} well today. Your analytical mind helps solve problems and organize thoughts. Health and wellness activities are favored. Take time for self-care and practical improvements.`,
    Libra: `Harmony and balance are themes for ${sign}. Relationships and partnerships flourish. Your diplomatic nature helps resolve conflicts. Aesthetic pursuits and creating beauty in your surroundings bring fulfillment.`,
    Scorpio: `Transformation and renewal inspire ${sign} today. Deep insights emerge, revealing hidden truths. Your intensity and passion fuel meaningful connections. Embrace change as a path to personal growth.`,
    Sagittarius: `Adventure and expansion call to ${sign}. Travel, learning, and exploring new philosophies enrich your spirit. Optimism guides you, and distant horizons beckon. Share your wisdom with others.`,
    Capricorn: `Ambition and structure support ${sign}'s goals today. Career matters progress, and your disciplined approach yields results. Long-term planning pays off. Build foundations for future success.`,
    Aquarius: `Innovation and humanitarian ideals motivate ${sign}. Your unique perspective brings fresh solutions to old problems. Friendships and group activities energize you. Embrace your originality and think outside the box.`,
    Pisces: `Intuition and spirituality guide ${sign} today. Dreams may hold important messages, and your compassionate nature helps others. Creative and artistic pursuits flow naturally. Connect with your inner wisdom.`,
  };

  return {
    sign,
    date: new Date().toISOString().split('T')[0],
    prediction: predictions[sign] || `Today is a day for ${sign} to focus on spiritual growth and inner peace. Trust in the divine timing of events in your life.`,
    type: 'daily',
  };
};

/**
 * Get zodiac sign from date of birth
 */
export const getZodiacSign = (month: number, day: number): ZodiacSign => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

