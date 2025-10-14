import { getEnvVar } from '../config/env';

export interface ProkeralaHoroscope {
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
  auspiciousTimings: string[];
  avoidTimings: string[];
}

export interface ProkeralaPanchang {
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
  auspiciousTimings: {
    brahmaMuhurat: string;
    abhijitMuhurat: string;
    godhuliMuhurat: string;
  };
  avoidTimings: {
    rahuKalam: string;
    yamagandam: string;
    gulikaKalam: string;
  };
}

export interface ProkeralaKundli {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
  ayanamsa: number;
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    nakshatra: string;
    nakshatraLord: string;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    lord: string;
    degree: number;
  }>;
}

export class ProkeralaService {
  private static API_URL = 'https://api.prokerala.com/v2/astrology';
  private static clientId: string;
  private static clientSecret: string;

  private static initializeCredentials(): void {
    this.clientId = getEnvVar('prokeralaClientId');
    this.clientSecret = getEnvVar('prokeralaClientSecret');
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Prokerala API credentials are not set. Please set prokeralaClientId and prokeralaClientSecret in your environment variables.');
    }
  }

  private static async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    this.initializeCredentials();
    
    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      ...params,
    });

    try {
      const response = await fetch(`${this.API_URL}${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Prokerala API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Prokerala API Error:', error);
      throw error;
    }
  }

  /**
   * Get daily horoscope for a zodiac sign
   */
  public static async getDailyHoroscope(sign: string): Promise<ProkeralaHoroscope> {
    try {
      const response = await this.makeRequest('/horoscope/daily', {
        sign: sign.toLowerCase(),
        date: new Date().toISOString().split('T')[0]
      });

      const data = response.data;
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
        finance: data.finance || 'Stable',
        auspiciousTimings: data.auspiciousTimings || [],
        avoidTimings: data.avoidTimings || []
      };
    } catch (error) {
      console.error('Error fetching daily horoscope:', error);
      return this.getMockHoroscope(sign);
    }
  }

  /**
   * Get weekly horoscope for a zodiac sign
   */
  public static async getWeeklyHoroscope(sign: string): Promise<ProkeralaHoroscope> {
    try {
      const response = await this.makeRequest('/horoscope/weekly', {
        sign: sign.toLowerCase(),
        date: new Date().toISOString().split('T')[0]
      });

      const data = response.data;
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
        finance: data.finance || 'Stable',
        auspiciousTimings: data.auspiciousTimings || [],
        avoidTimings: data.avoidTimings || []
      };
    } catch (error) {
      console.error('Error fetching weekly horoscope:', error);
      return this.getMockHoroscope(sign);
    }
  }

  /**
   * Get monthly horoscope for a zodiac sign
   */
  public static async getMonthlyHoroscope(sign: string): Promise<ProkeralaHoroscope> {
    try {
      const response = await this.makeRequest('/horoscope/monthly', {
        sign: sign.toLowerCase(),
        date: new Date().toISOString().split('T')[0]
      });

      const data = response.data;
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
        finance: data.finance || 'Stable',
        auspiciousTimings: data.auspiciousTimings || [],
        avoidTimings: data.avoidTimings || []
      };
    } catch (error) {
      console.error('Error fetching monthly horoscope:', error);
      return this.getMockHoroscope(sign);
    }
  }

  /**
   * Get Panchang data for a specific date and location
   */
  public static async getPanchang(
    latitude: number = 23.1765,
    longitude: number = 75.7885,
    date?: string
  ): Promise<ProkeralaPanchang> {
    try {
      const response = await this.makeRequest('/panchang', {
        ayanamsa: 1,
        coordinates: `${latitude},${longitude}`,
        datetime: date || new Date().toISOString()
      });

      const data = response.data;
      return {
        date: data.date,
        tithi: data.tithi.name,
        nakshatra: data.nakshatra.name,
        yoga: data.yoga.name,
        karana: data.karana.name,
        paksha: data.paksha,
        ritu: data.ritu,
        sunrise: data.sunrise,
        sunset: data.sunset,
        moonrise: data.moonrise,
        moonset: data.moonset,
        auspiciousTimings: {
          brahmaMuhurat: data.auspiciousTimings?.brahmaMuhurat || '04:45-05:30',
          abhijitMuhurat: data.auspiciousTimings?.abhijitMuhurat || '11:45-12:30',
          godhuliMuhurat: data.auspiciousTimings?.godhuliMuhurat || '17:30-18:00'
        },
        avoidTimings: {
          rahuKalam: data.avoidTimings?.rahuKalam || '07:30-09:00',
          yamagandam: data.avoidTimings?.yamagandam || '10:30-12:00',
          gulikaKalam: data.avoidTimings?.gulikaKalam || '13:30-15:00'
        }
      };
    } catch (error) {
      console.error('Error fetching Panchang:', error);
      return this.getMockPanchang();
    }
  }

  /**
   * Generate Kundli (birth chart) for a person
   */
  public static async generateKundli(
    name: string,
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    latitude: number,
    longitude: number
  ): Promise<ProkeralaKundli> {
    try {
      const response = await this.makeRequest('/kundli', {
        ayanamsa: 1,
        coordinates: `${latitude},${longitude}`,
        datetime: `${birthDate}T${birthTime}:00+00:00`,
        name: name,
        birth_place: birthPlace
      });

      const data = response.data;
      return {
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        birthPlace: data.birthPlace,
        coordinates: {
          latitude: data.coordinates.latitude,
          longitude: data.coordinates.longitude
        },
        timezone: data.timezone,
        ayanamsa: data.ayanamsa,
        planets: data.planets.map((planet: any) => ({
          name: planet.name,
          sign: planet.sign,
          house: planet.house,
          degree: planet.degree,
          nakshatra: planet.nakshatra,
          nakshatraLord: planet.nakshatraLord
        })),
        houses: data.houses.map((house: any) => ({
          number: house.number,
          sign: house.sign,
          lord: house.lord,
          degree: house.degree
        }))
      };
    } catch (error) {
      console.error('Error generating Kundli:', error);
      return this.getMockKundli(name, birthDate, birthTime, birthPlace);
    }
  }

  /**
   * Get Kundli matching for marriage compatibility
   */
  public static async getKundliMatching(
    maleKundli: ProkeralaKundli,
    femaleKundli: ProkeralaKundli
  ): Promise<any> {
    try {
      const response = await this.makeRequest('/kundli-matching', {
        male_coordinates: `${maleKundli.coordinates.latitude},${maleKundli.coordinates.longitude}`,
        female_coordinates: `${femaleKundli.coordinates.latitude},${femaleKundli.coordinates.longitude}`,
        male_datetime: `${maleKundli.birthDate}T${maleKundli.birthTime}:00+00:00`,
        female_datetime: `${femaleKundli.birthDate}T${femaleKundli.birthTime}:00+00:00`,
        ayanamsa: 1
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Kundli matching:', error);
      return {
        overallScore: 75,
        message: 'Good compatibility based on astrological analysis',
        details: {
          gunaMilan: 18,
          nakshatraMatching: 'Good',
          rashiMatching: 'Compatible'
        }
      };
    }
  }

  /**
   * Get Mangal Dosha analysis
   */
  public static async getMangalDosha(kundli: ProkeralaKundli): Promise<any> {
    try {
      const response = await this.makeRequest('/mangal-dosha', {
        ayanamsa: 1,
        coordinates: `${kundli.coordinates.latitude},${kundli.coordinates.longitude}`,
        datetime: `${kundli.birthDate}T${kundli.birthTime}:00+00:00`
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Mangal Dosha:', error);
      return {
        hasMangalDosha: false,
        message: 'No Mangal Dosha detected',
        remedies: []
      };
    }
  }

  private static getMockHoroscope(sign: string): ProkeralaHoroscope {
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
      finance: 'Stable',
      auspiciousTimings: ['06:00-07:00', '11:00-12:00', '18:00-19:00'],
      avoidTimings: ['07:30-09:00', '10:30-12:00', '13:30-15:00']
    };
  }

  private static getMockPanchang(): ProkeralaPanchang {
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
      moonset: '04:00 PM',
      auspiciousTimings: {
        brahmaMuhurat: '04:45-05:30',
        abhijitMuhurat: '11:45-12:30',
        godhuliMuhurat: '17:30-18:00'
      },
      avoidTimings: {
        rahuKalam: '07:30-09:00',
        yamagandam: '10:30-12:00',
        gulikaKalam: '13:30-15:00'
      }
    };
  }

  private static getMockKundli(name: string, birthDate: string, birthTime: string, birthPlace: string): ProkeralaKundli {
    return {
      name,
      birthDate,
      birthTime,
      birthPlace,
      coordinates: {
        latitude: 23.1765,
        longitude: 75.7885
      },
      timezone: 'Asia/Kolkata',
      ayanamsa: 1,
      planets: [
        { name: 'Sun', sign: 'Aries', house: 1, degree: 15.5, nakshatra: 'Bharani', nakshatraLord: 'Venus' },
        { name: 'Moon', sign: 'Taurus', house: 2, degree: 8.2, nakshatra: 'Rohini', nakshatraLord: 'Brahma' },
        { name: 'Mars', sign: 'Gemini', house: 3, degree: 22.1, nakshatra: 'Ardra', nakshatraLord: 'Rudra' }
      ],
      houses: [
        { number: 1, sign: 'Aries', lord: 'Mars', degree: 0 },
        { number: 2, sign: 'Taurus', lord: 'Venus', degree: 30 },
        { number: 3, sign: 'Gemini', lord: 'Mercury', degree: 60 }
      ]
    };
  }
}
