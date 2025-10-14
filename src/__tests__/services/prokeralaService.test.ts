import { ProkeralaService } from '../../services/prokeralaService';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
jest.mock('../../config/env', () => ({
  getEnvVar: jest.fn((key: string) => {
    if (key === 'prokeralaClientId') return 'test-client-id';
    if (key === 'prokeralaClientSecret') return 'test-client-secret';
    return 'test-value';
  })
}));

describe('ProkeralaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get daily horoscope', async () => {
    const mockResponse = {
      data: {
        sign: 'Aries',
        date: '2023-10-27',
        prediction: 'A day of new beginnings.',
        mood: 'Energetic',
        compatibility: 'Leo',
        luckyNumbers: [9, 18, 27],
        luckyColors: ['Red', 'Gold'],
        love: 'Good',
        career: 'Positive',
        health: 'Good',
        finance: 'Stable',
        auspiciousTimings: ['06:00-07:00'],
        avoidTimings: ['07:30-09:00']
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await ProkeralaService.getDailyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('A day of new beginnings.');
    expect(horoscope.luckyNumbers).toEqual([9, 18, 27]);
  });

  it('should get weekly horoscope', async () => {
    const mockResponse = {
      data: {
        sign: 'Aries',
        date: '2023-10-27',
        prediction: 'A productive week ahead.',
        mood: 'Energetic',
        compatibility: 'Leo',
        luckyNumbers: [9, 18, 27],
        luckyColors: ['Red', 'Gold'],
        love: 'Good',
        career: 'Positive',
        health: 'Good',
        finance: 'Stable',
        auspiciousTimings: ['06:00-07:00'],
        avoidTimings: ['07:30-09:00']
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await ProkeralaService.getWeeklyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('A productive week ahead.');
  });

  it('should get monthly horoscope', async () => {
    const mockResponse = {
      data: {
        sign: 'Aries',
        date: '2023-10-27',
        prediction: 'Financial gains are likely this month.',
        mood: 'Energetic',
        compatibility: 'Leo',
        luckyNumbers: [9, 18, 27],
        luckyColors: ['Red', 'Gold'],
        love: 'Good',
        career: 'Positive',
        health: 'Good',
        finance: 'Stable',
        auspiciousTimings: ['06:00-07:00'],
        avoidTimings: ['07:30-09:00']
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const horoscope = await ProkeralaService.getMonthlyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBe('Financial gains are likely this month.');
  });

  it('should get Panchang data', async () => {
    const mockResponse = {
      data: {
        date: '2023-10-27',
        tithi: { name: 'Trayodashi' },
        nakshatra: { name: 'Ashwini' },
        yoga: { name: 'Ayushman' },
        karana: { name: 'Kaulava' },
        paksha: 'Krishna',
        ritu: 'Sharad',
        sunrise: '06:30',
        sunset: '17:45',
        moonrise: '03:00',
        moonset: '16:00',
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
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const panchang = await ProkeralaService.getPanchang(23.1765, 75.7885);
    
    expect(panchang.tithi).toBe('Trayodashi');
    expect(panchang.nakshatra).toBe('Ashwini');
    expect(panchang.auspiciousTimings.brahmaMuhurat).toBe('04:45-05:30');
  });

  it('should generate Kundli', async () => {
    const mockResponse = {
      data: {
        name: 'John Doe',
        birthDate: '1990-01-01',
        birthTime: '12:00:00',
        birthPlace: 'Mumbai',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        },
        timezone: 'Asia/Kolkata',
        ayanamsa: 1,
        planets: [
          {
            name: 'Sun',
            sign: 'Aries',
            house: 1,
            degree: 15.5,
            nakshatra: 'Bharani',
            nakshatraLord: 'Venus'
          }
        ],
        houses: [
          {
            number: 1,
            sign: 'Aries',
            lord: 'Mars',
            degree: 0
          }
        ]
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const kundli = await ProkeralaService.generateKundli(
      'John Doe',
      '1990-01-01',
      '12:00:00',
      'Mumbai',
      19.0760,
      72.8777
    );
    
    expect(kundli.name).toBe('John Doe');
    expect(kundli.planets).toHaveLength(1);
    expect(kundli.planets[0].name).toBe('Sun');
  });

  it('should handle API errors and return mock data', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const horoscope = await ProkeralaService.getDailyHoroscope('Aries');
    
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.prediction).toBeDefined();
  });

  it('should handle missing API credentials', async () => {
    const { getEnvVar } = require('../../config/env');
    (getEnvVar as jest.Mock)
      .mockReturnValueOnce('') // prokeralaClientId
      .mockReturnValueOnce('test-client-secret'); // prokeralaClientSecret

    await expect(ProkeralaService.getDailyHoroscope('Aries')).rejects.toThrow('Prokerala API credentials are not set');
  });
});
