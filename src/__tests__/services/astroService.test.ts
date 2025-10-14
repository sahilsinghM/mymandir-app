import { AstroService } from '../../services/astroService';

describe('AstroService', () => {
  it('should get daily horoscope', async () => {
    const horoscope = await AstroService.getDailyHoroscope('Aries');
    expect(horoscope).toBeDefined();
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.date).toBeDefined();
    expect(horoscope.prediction).toBeDefined();
  });

  it('should get weekly horoscope', async () => {
    const horoscope = await AstroService.getWeeklyHoroscope('Aries');
    expect(horoscope).toBeDefined();
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.weekStart).toBeDefined();
    expect(horoscope.weekEnd).toBeDefined();
    expect(horoscope.predictions).toBeDefined();
  });

  it('should get monthly horoscope', async () => {
    const horoscope = await AstroService.getMonthlyHoroscope('Aries');
    expect(horoscope).toBeDefined();
    expect(horoscope.sign).toBe('Aries');
    expect(horoscope.month).toBeDefined();
    expect(horoscope.year).toBeDefined();
    expect(horoscope.predictions).toBeDefined();
  });

  it('should get panchang data', async () => {
    const panchang = await AstroService.getPanchang();
    expect(panchang).toBeDefined();
    expect(panchang.date).toBeDefined();
    expect(panchang.tithi).toBeDefined();
    expect(panchang.nakshatra).toBeDefined();
    expect(panchang.yoga).toBeDefined();
    expect(panchang.karana).toBeDefined();
  });

  it('should get auspicious timings', async () => {
    const timings = await AstroService.getAuspiciousTimings();
    expect(timings).toBeDefined();
    expect(timings.sunrise).toBeDefined();
    expect(timings.sunset).toBeDefined();
    expect(timings.moonrise).toBeDefined();
    expect(timings.moonset).toBeDefined();
  });
});
