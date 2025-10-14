// Astrology service with mock data
export interface Horoscope {
  sign: string;
  date: string;
  prediction: string;
  luckyNumbers: number[];
  luckyColors: string[];
  mood: string;
  compatibility: string;
}

export interface WeeklyHoroscope {
  sign: string;
  weekStart: string;
  weekEnd: string;
  predictions: {
    day: string;
    prediction: string;
    rating: number; // 1-5 stars
  }[];
  overallPrediction: string;
}

export interface MonthlyHoroscope {
  sign: string;
  month: string;
  year: number;
  predictions: {
    week: number;
    prediction: string;
    focus: string;
  }[];
  overallPrediction: string;
}

export interface Panchang {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: string;
  ritu: string;
}

export interface AuspiciousTimings {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  brahmaMuhurat: string;
  abhijitMuhurat: string;
  rahuKaal: string;
  gulikaKaal: string;
}

export class AstroService {
  private static readonly ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  private static readonly MOODS = [
    'Positive', 'Neutral', 'Cautious', 'Optimistic', 'Reflective', 'Energetic'
  ];

  private static readonly COMPATIBILITY = [
    'High', 'Medium', 'Low', 'Excellent', 'Good', 'Fair'
  ];

  private static readonly TITHIS = [
    'Purnima', 'Krishna Paksha Pratipada', 'Krishna Paksha Dwitiya', 'Krishna Paksha Tritiya',
    'Krishna Paksha Chaturthi', 'Krishna Paksha Panchami', 'Krishna Paksha Shashthi',
    'Krishna Paksha Saptami', 'Krishna Paksha Ashtami', 'Krishna Paksha Navami',
    'Krishna Paksha Dashami', 'Krishna Paksha Ekadashi', 'Krishna Paksha Dwadashi',
    'Krishna Paksha Trayodashi', 'Krishna Paksha Chaturdashi', 'Amavasya'
  ];

  private static readonly NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  private static readonly YOGAS = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
    'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
    'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
    'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
    'Brahma', 'Indra', 'Vaidhriti'
  ];

  private static readonly KARANAS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija',
    'Bhadra', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kinstughna'
  ];

  private static readonly RITUS = [
    'Vasant', 'Grishma', 'Varsha', 'Sharad', 'Hemant', 'Shishir'
  ];

  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private static getWeekDates(): { start: string; end: string } {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  }

  private static getMonthYear(): { month: string; year: number } {
    const now = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return {
      month: months[now.getMonth()],
      year: now.getFullYear()
    };
  }

  /**
   * Get daily horoscope for a zodiac sign
   */
  static async getDailyHoroscope(sign: string): Promise<Horoscope> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const predictions = [
      `Today brings new opportunities for ${sign}. Trust your instincts and take calculated risks.`,
      `A day of reflection and planning for ${sign}. Focus on your long-term goals.`,
      `Social connections will be important today for ${sign}. Reach out to friends and family.`,
      `Creative energy is high for ${sign}. Express yourself through art or music.`,
      `Financial matters require attention today for ${sign}. Review your budget carefully.`,
      `Health and wellness should be your priority today, ${sign}. Take time for self-care.`,
      `Communication is key today for ${sign}. Speak your truth with confidence.`,
      `Travel or learning opportunities may arise for ${sign}. Be open to new experiences.`,
      `Relationships take center stage today for ${sign}. Nurture your connections.`,
      `Career advancement is possible today for ${sign}. Showcase your skills.`
    ];

    return {
      sign,
      date: this.getCurrentDate(),
      prediction: this.getRandomElement(predictions),
      luckyNumbers: this.getRandomElements([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], 3),
      luckyColors: this.getRandomElements(['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gold', 'Silver', 'White'], 2),
      mood: this.getRandomElement(this.MOODS),
      compatibility: this.getRandomElement(this.COMPATIBILITY)
    };
  }

  /**
   * Get weekly horoscope for a zodiac sign
   */
  static async getWeeklyHoroscope(sign: string): Promise<WeeklyHoroscope> {
    await new Promise(resolve => setTimeout(resolve, 150));

    const weekDates = this.getWeekDates();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const predictions = days.map(day => ({
      day,
      prediction: `A ${this.getRandomElement(['productive', 'peaceful', 'exciting', 'challenging', 'rewarding'])} day for ${sign}.`,
      rating: this.getRandomNumber(3, 5)
    }));

    return {
      sign,
      weekStart: weekDates.start,
      weekEnd: weekDates.end,
      predictions,
      overallPrediction: `This week brings ${this.getRandomElement(['growth', 'stability', 'change', 'success', 'learning'])} for ${sign}. Focus on ${this.getRandomElement(['relationships', 'career', 'health', 'creativity', 'spirituality'])}.`
    };
  }

  /**
   * Get monthly horoscope for a zodiac sign
   */
  static async getMonthlyHoroscope(sign: string): Promise<MonthlyHoroscope> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const { month, year } = this.getMonthYear();
    const weeks = [1, 2, 3, 4];
    
    const predictions = weeks.map(week => ({
      week,
      prediction: `Week ${week} brings ${this.getRandomElement(['new opportunities', 'challenges', 'growth', 'stability', 'creativity'])} for ${sign}.`,
      focus: this.getRandomElement(['Career', 'Relationships', 'Health', 'Finance', 'Spirituality', 'Learning'])
    }));

    return {
      sign,
      month,
      year,
      predictions,
      overallPrediction: `${month} ${year} is a ${this.getRandomElement(['transformative', 'productive', 'peaceful', 'exciting', 'challenging'])} month for ${sign}. Focus on ${this.getRandomElement(['personal growth', 'relationships', 'career advancement', 'health and wellness', 'creative expression'])}.`
    };
  }

  /**
   * Get Panchang data for today
   */
  static async getPanchang(): Promise<Panchang> {
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      date: this.getCurrentDate(),
      tithi: this.getRandomElement(this.TITHIS),
      nakshatra: this.getRandomElement(this.NAKSHATRAS),
      yoga: this.getRandomElement(this.YOGAS),
      karana: this.getRandomElement(this.KARANAS),
      paksha: this.getRandomElement(['Shukla Paksha', 'Krishna Paksha']),
      ritu: this.getRandomElement(this.RITUS)
    };
  }

  /**
   * Get auspicious timings for today
   */
  static async getAuspiciousTimings(): Promise<AuspiciousTimings> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const generateTime = (hour: number, minute: number) => {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    return {
      sunrise: generateTime(this.getRandomNumber(5, 7), this.getRandomNumber(0, 59)),
      sunset: generateTime(this.getRandomNumber(17, 19), this.getRandomNumber(0, 59)),
      moonrise: generateTime(this.getRandomNumber(18, 23), this.getRandomNumber(0, 59)),
      moonset: generateTime(this.getRandomNumber(5, 11), this.getRandomNumber(0, 59)),
      brahmaMuhurat: generateTime(this.getRandomNumber(4, 5), this.getRandomNumber(0, 59)),
      abhijitMuhurat: generateTime(this.getRandomNumber(11, 12), this.getRandomNumber(0, 59)),
      rahuKaal: generateTime(this.getRandomNumber(9, 10), this.getRandomNumber(0, 59)),
      gulikaKaal: generateTime(this.getRandomNumber(13, 14), this.getRandomNumber(0, 59))
    };
  }

  /**
   * Get all zodiac signs
   */
  static getZodiacSigns(): string[] {
    return [...this.ZODIAC_SIGNS];
  }
}
