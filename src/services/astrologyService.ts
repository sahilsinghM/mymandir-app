import { getEnvVar } from '../config/env';

export interface Horoscope {
  sign: string;
  date: string;
  prediction: string;
  mood: string;
  compatibility: string;
  luckyNumbers: number[];
  luckyColors: string[];
  love: string;
  career: string;
  health: string;
  finance: string;
}

export interface Panchang {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: string;
  ritu: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
}

export interface AuspiciousTimings {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  brahmaMuhurat: string;
  abhijitMuhurat: string;
  rahuKalam: string;
  yamagandam: string;
}

export interface AstrologyProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  freeTier: boolean;
  monthlyLimit: number;
  costPerRequest: number;
}

export class AstrologyService {
  private static providers: AstrologyProvider[] = [
    {
      name: 'AztroAPI',
      baseUrl: 'https://aztro.sameerkumar.website',
      apiKey: '',
      freeTier: true,
      monthlyLimit: 1000,
      costPerRequest: 0
    },
    {
      name: 'AstroAPI',
      baseUrl: 'https://api.astrologyapi.com/v1',
      apiKey: getEnvVar('astroApiKey') || '',
      freeTier: true,
      monthlyLimit: 1000,
      costPerRequest: 0
    },
    {
      name: 'DivineAPI',
      baseUrl: 'https://api.divineapi.com/v1',
      apiKey: getEnvVar('divineApiKey') || '',
      freeTier: false,
      monthlyLimit: 50000,
      costPerRequest: 0.0004
    },
    {
      name: 'AstrologyAPI',
      baseUrl: 'https://api.astrologyapi.com/v1',
      apiKey: getEnvVar('astrologyApiKey') || '',
      freeTier: false,
      monthlyLimit: 150000,
      costPerRequest: 0.0002
    }
  ];

  private static currentProvider: AstrologyProvider = this.providers[0]; // Default to AztroAPI

  /**
   * Get daily horoscope using the most cost-effective API
   */
  public static async getDailyHoroscope(sign: string): Promise<Horoscope> {
    try {
      // Try free APIs first
      for (const provider of this.providers.filter(p => p.freeTier)) {
        try {
          const horoscope = await this.fetchHoroscopeFromProvider(provider, sign);
          if (horoscope) {
            this.currentProvider = provider;
            return horoscope;
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${provider.name}:`, error);
          continue;
        }
      }

      // Fallback to paid APIs if free ones fail
      for (const provider of this.providers.filter(p => !p.freeTier)) {
        try {
          const horoscope = await this.fetchHoroscopeFromProvider(provider, sign);
          if (horoscope) {
            this.currentProvider = provider;
            return horoscope;
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${provider.name}:`, error);
          continue;
        }
      }

      // If all APIs fail, return mock data
      return this.getMockHoroscope(sign);
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      return this.getMockHoroscope(sign);
    }
  }

  /**
   * Get weekly horoscope
   */
  public static async getWeeklyHoroscope(sign: string): Promise<{ sign: string; week: string; prediction: string }> {
    try {
      if (this.currentProvider.name === 'AztroAPI') {
        const response = await fetch(`${this.currentProvider.baseUrl}/weekly?sign=${sign}&day=today`);
        const data = await response.json();
        return {
          sign: data.name,
          week: `${data.current_date} - ${data.week}`,
          prediction: data.description
        };
      }

      // For other providers, use daily horoscope as fallback
      const daily = await this.getDailyHoroscope(sign);
      return {
        sign: daily.sign,
        week: 'This Week',
        prediction: daily.prediction
      };
    } catch (error) {
      console.error('Error fetching weekly horoscope:', error);
      return {
        sign,
        week: 'This Week',
        prediction: `This week, ${sign}, you will find opportunities for growth and self-reflection.`
      };
    }
  }

  /**
   * Get monthly horoscope
   */
  public static async getMonthlyHoroscope(sign: string): Promise<{ sign: string; month: string; prediction: string }> {
    try {
      if (this.currentProvider.name === 'AztroAPI') {
        const response = await fetch(`${this.currentProvider.baseUrl}/monthly?sign=${sign}&day=today`);
        const data = await response.json();
        return {
          sign: data.name,
          month: data.current_date,
          prediction: data.description
        };
      }

      // For other providers, use daily horoscope as fallback
      const daily = await this.getDailyHoroscope(sign);
      return {
        sign: daily.sign,
        month: 'This Month',
        prediction: daily.prediction
      };
    } catch (error) {
      console.error('Error fetching monthly horoscope:', error);
      return {
        sign,
        month: 'This Month',
        prediction: `This month brings new challenges and rewards for ${sign}. Stay focused on your goals.`
      };
    }
  }

  /**
   * Get Panchang data
   */
  public static async getPanchang(): Promise<Panchang> {
    try {
      // Try DivineAPI first (best for Panchang)
      const divineProvider = this.providers.find(p => p.name === 'DivineAPI');
      if (divineProvider && divineProvider.apiKey) {
        const response = await fetch(`${divineProvider.baseUrl}/panchang`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${divineProvider.apiKey}`
          },
          body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            timezone: 'Asia/Kolkata'
          })
        });

        if (response.ok) {
          const data = await response.json();
          return this.formatPanchangFromDivineAPI(data);
        }
      }

      // Fallback to mock data
      return this.getMockPanchang();
    } catch (error) {
      console.error('Error fetching Panchang:', error);
      return this.getMockPanchang();
    }
  }

  /**
   * Get auspicious timings
   */
  public static async getAuspiciousTimings(): Promise<AuspiciousTimings> {
    try {
      const divineProvider = this.providers.find(p => p.name === 'DivineAPI');
      if (divineProvider && divineProvider.apiKey) {
        const response = await fetch(`${divineProvider.baseUrl}/auspicious-timings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${divineProvider.apiKey}`
          },
          body: JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            timezone: 'Asia/Kolkata'
          })
        });

        if (response.ok) {
          const data = await response.json();
          return this.formatTimingsFromDivineAPI(data);
        }
      }

      // Fallback to mock data
      return this.getMockTimings();
    } catch (error) {
      console.error('Error fetching auspicious timings:', error);
      return this.getMockTimings();
    }
  }

  /**
   * Get zodiac signs
   */
  public static getZodiacSigns(): string[] {
    return [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
  }

  /**
   * Get current provider info
   */
  public static getCurrentProvider(): AstrologyProvider {
    return this.currentProvider;
  }

  /**
   * Switch to a different provider
   */
  public static switchProvider(providerName: string): boolean {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider) {
      this.currentProvider = provider;
      return true;
    }
    return false;
  }

  private static async fetchHoroscopeFromProvider(provider: AstrologyProvider, sign: string): Promise<Horoscope | null> {
    switch (provider.name) {
      case 'AztroAPI':
        return this.fetchFromAztroAPI(sign);
      case 'AstroAPI':
        return this.fetchFromAstroAPI(provider, sign);
      case 'DivineAPI':
        return this.fetchFromDivineAPI(provider, sign);
      case 'AstrologyAPI':
        return this.fetchFromAstrologyAPI(provider, sign);
      default:
        return null;
    }
  }

  private static async fetchFromAztroAPI(sign: string): Promise<Horoscope | null> {
    const response = await fetch(`${this.currentProvider.baseUrl}/?sign=${sign}&day=today`, {
      method: 'POST'
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      sign: data.name,
      date: data.current_date,
      prediction: data.description,
      mood: data.mood,
      compatibility: data.compatibility,
      luckyNumbers: data.lucky_number.split(',').map((n: string) => parseInt(n.trim())),
      luckyColors: data.color.split(',').map((c: string) => c.trim()),
      love: data.love,
      career: data.career,
      health: data.health,
      finance: data.finance
    };
  }

  private static async fetchFromAstroAPI(provider: AstrologyProvider, sign: string): Promise<Horoscope | null> {
    const response = await fetch(`${provider.baseUrl}/horoscope/daily/${sign}`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      sign: data.sign,
      date: data.date,
      prediction: data.prediction,
      mood: data.mood || 'Positive',
      compatibility: data.compatibility || 'Good',
      luckyNumbers: data.luckyNumbers || [],
      luckyColors: data.luckyColors || [],
      love: data.love || 'Good',
      career: data.career || 'Positive',
      health: data.health || 'Good',
      finance: data.finance || 'Stable'
    };
  }

  private static async fetchFromDivineAPI(provider: AstrologyProvider, sign: string): Promise<Horoscope | null> {
    const response = await fetch(`${provider.baseUrl}/horoscope/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        sign,
        date: new Date().toISOString().split('T')[0]
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      sign: data.sign,
      date: data.date,
      prediction: data.prediction,
      mood: data.mood || 'Positive',
      compatibility: data.compatibility || 'Good',
      luckyNumbers: data.luckyNumbers || [],
      luckyColors: data.luckyColors || [],
      love: data.love || 'Good',
      career: data.career || 'Positive',
      health: data.health || 'Good',
      finance: data.finance || 'Stable'
    };
  }

  private static async fetchFromAstrologyAPI(provider: AstrologyProvider, sign: string): Promise<Horoscope | null> {
    const response = await fetch(`${provider.baseUrl}/horoscope/daily/${sign}`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      sign: data.sign,
      date: data.date,
      prediction: data.prediction,
      mood: data.mood || 'Positive',
      compatibility: data.compatibility || 'Good',
      luckyNumbers: data.luckyNumbers || [],
      luckyColors: data.luckyColors || [],
      love: data.love || 'Good',
      career: data.career || 'Positive',
      health: data.health || 'Good',
      finance: data.finance || 'Stable'
    };
  }

  private static formatPanchangFromDivineAPI(data: any): Panchang {
    return {
      date: data.date,
      tithi: data.tithi,
      nakshatra: data.nakshatra,
      yoga: data.yoga,
      karana: data.karana,
      paksha: data.paksha,
      ritu: data.ritu,
      sunrise: data.sunrise,
      sunset: data.sunset,
      moonrise: data.moonrise,
      moonset: data.moonset
    };
  }

  private static formatTimingsFromDivineAPI(data: any): AuspiciousTimings {
    return {
      sunrise: data.sunrise,
      sunset: data.sunset,
      moonrise: data.moonrise,
      moonset: data.moonset,
      brahmaMuhurat: data.brahmaMuhurat,
      abhijitMuhurat: data.abhijitMuhurat,
      rahuKalam: data.rahuKalam,
      yamagandam: data.yamagandam
    };
  }

  private static getMockHoroscope(sign: string): Horoscope {
    const mockData = {
      Aries: {
        prediction: 'A day of new beginnings and fresh perspectives. Embrace challenges with courage.',
        mood: 'Energetic',
        compatibility: 'Leo',
        luckyNumbers: [9, 18, 27],
        luckyColors: ['Red', 'Gold']
      },
      Taurus: {
        prediction: 'Focus on stability and comfort. A good day for financial planning.',
        mood: 'Calm',
        compatibility: 'Virgo',
        luckyNumbers: [6, 15, 24],
        luckyColors: ['Green', 'Pink']
      },
      Gemini: {
        prediction: 'Communication is key. Express your thoughts clearly and listen actively.',
        mood: 'Curious',
        compatibility: 'Libra',
        luckyNumbers: [5, 14, 23],
        luckyColors: ['Yellow', 'Blue']
      },
      Cancer: {
        prediction: 'Nurture your relationships and home life. Emotional connections are strong.',
        mood: 'Sensitive',
        compatibility: 'Scorpio',
        luckyNumbers: [2, 11, 20],
        luckyColors: ['Silver', 'White']
      },
      Leo: {
        prediction: 'Shine bright and take the lead. Your creativity is at its peak.',
        mood: 'Confident',
        compatibility: 'Aries',
        luckyNumbers: [1, 10, 19],
        luckyColors: ['Orange', 'Purple']
      },
      Virgo: {
        prediction: 'Attention to detail will bring success. Organize your tasks efficiently.',
        mood: 'Analytical',
        compatibility: 'Taurus',
        luckyNumbers: [3, 12, 21],
        luckyColors: ['Brown', 'Navy']
      },
      Libra: {
        prediction: 'Seek balance and harmony in all aspects. Diplomacy will serve you well.',
        mood: 'Harmonious',
        compatibility: 'Gemini',
        luckyNumbers: [6, 15, 24],
        luckyColors: ['Blue', 'Green']
      },
      Scorpio: {
        prediction: 'Deep insights and transformations are possible. Trust your intuition.',
        mood: 'Intense',
        compatibility: 'Cancer',
        luckyNumbers: [4, 13, 22],
        luckyColors: ['Black', 'Red']
      },
      Sagittarius: {
        prediction: 'Adventure calls! Explore new ideas and expand your horizons.',
        mood: 'Optimistic',
        compatibility: 'Aquarius',
        luckyNumbers: [3, 12, 21],
        luckyColors: ['Purple', 'Dark Blue']
      },
      Capricorn: {
        prediction: 'Discipline and hard work pay off. Focus on your long-term goals.',
        mood: 'Disciplined',
        compatibility: 'Pisces',
        luckyNumbers: [8, 17, 26],
        luckyColors: ['Grey', 'Indigo']
      },
      Aquarius: {
        prediction: 'Innovate and connect with like-minded individuals. Embrace your unique vision.',
        mood: 'Inventive',
        compatibility: 'Sagittarius',
        luckyNumbers: [4, 13, 22],
        luckyColors: ['Electric Blue', 'Silver']
      },
      Pisces: {
        prediction: 'Tap into your intuition and creativity. A day for spiritual reflection.',
        mood: 'Dreamy',
        compatibility: 'Capricorn',
        luckyNumbers: [7, 16, 25],
        luckyColors: ['Sea Green', 'Violet']
      }
    };

    const data = mockData[sign as keyof typeof mockData] || mockData.Aries;
    
    return {
      sign,
      date: new Date().toLocaleDateString(),
      prediction: data.prediction,
      mood: data.mood,
      compatibility: data.compatibility,
      luckyNumbers: data.luckyNumbers,
      luckyColors: data.luckyColors,
      love: 'Good',
      career: 'Positive',
      health: 'Good',
      finance: 'Stable'
    };
  }

  private static getMockPanchang(): Panchang {
    return {
      date: new Date().toLocaleDateString(),
      tithi: 'Trayodashi (Krishna Paksha)',
      nakshatra: 'Ashwini',
      yoga: 'Ayushman',
      karana: 'Kaulava',
      paksha: 'Krishna',
      ritu: 'Sharad (Autumn)',
      sunrise: '06:30 AM',
      sunset: '05:45 PM',
      moonrise: '03:00 AM',
      moonset: '04:00 PM'
    };
  }

  private static getMockTimings(): AuspiciousTimings {
    return {
      sunrise: '06:30 AM',
      sunset: '05:45 PM',
      moonrise: '03:00 AM',
      moonset: '04:00 PM',
      brahmaMuhurat: '04:45 AM - 05:30 AM',
      abhijitMuhurat: '11:45 AM - 12:30 PM',
      rahuKalam: '07:30 AM - 09:00 AM',
      yamagandam: '10:30 AM - 12:00 PM'
    };
  }
}
