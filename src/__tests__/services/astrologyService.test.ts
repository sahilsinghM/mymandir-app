import { AstrologyService } from '../../services/astrologyService';

// Mock fetch
global.fetch = jest.fn();

describe('AstrologyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get daily horoscope from AztroAPI', async () => {
    const mockResponse = {
      name: 'Aries',
      current_date: '2023-10-27',
      description: 'A day of new beginnings.',
      mood: 'Energetic',
      compatibility: 'Leo',
      lucky_number: '9, 18, 27',
      color: 'Red, Gold',
      love: 'Good',
      career: 'Positive',
      health: 'Good',
      finance: 'Stable'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await AstrologyService.getDailyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('A day of new beginnings.');
    expect(horoscope.luckyNumbers).toEqual([9, 18, 27]);
  });

  it('should get weekly horoscope', async () => {
    const mockResponse = {
      name: 'Aries',
      current_date: '2023-10-27',
      week: 'Oct 23 - Oct 29',
      description: 'A productive week ahead.'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await AstrologyService.getWeeklyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('A productive week ahead.');
  });

  it('should get monthly horoscope', async () => {
    const mockResponse = {
      name: 'Aries',
      current_date: '2023-10-27',
      description: 'Financial gains are likely this month.'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await AstrologyService.getMonthlyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('Financial gains are likely this month.');
  });

  it('should get zodiac signs', () => {
    const signs = AstrologyService.getZodiacSigns();
    
    expect(signs).toHaveLength(12);
    expect(signs).toContain('Aries');
    expect(signs).toContain('Pisces');
  });

  it('should switch providers', () => {
    const result = AstrologyService.switchProvider('AstroAPI');
    expect(result).toBe(true);
    
    const currentProvider = AstrologyService.getCurrentProvider();
    expect(currentProvider.name).toBe('AstroAPI');
  });

  it('should handle API errors and return mock data', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const horoscope = await AstrologyService.getDailyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBeDefined();
  });

  it('should get panchang data', async () => {
    const mockResponse = {
      date: '2023-10-27',
      tithi: 'Trayodashi',
      nakshatra: 'Ashwini',
      yoga: 'Ayushman',
      karana: 'Kaulava',
      paksha: 'Krishna',
      ritu: 'Sharad',
      sunrise: '06:30',
      sunset: '17:45',
      moonrise: '03:00',
      moonset: '16:00'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const panchang = await AstrologyService.getPanchang();
    
    expect(panchang.tithi).toBe('Trayodashi');
    expect(panchang.nakshatra).toBe('Ashwini');
  });

  it('should get auspicious timings', async () => {
    const mockResponse = {
      sunrise: '06:30',
      sunset: '17:45',
      moonrise: '03:00',
      moonset: '16:00',
      brahmaMuhurat: '04:45-05:30',
      abhijitMuhurat: '11:45-12:30',
      rahuKalam: '07:30-09:00',
      yamagandam: '10:30-12:00'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const timings = await AstrologyService.getAuspiciousTimings();
    
    expect(timings.sunrise).toBe('06:30');
    expect(timings.brahmaMuhurat).toBe('04:45-05:30');
  });
});
