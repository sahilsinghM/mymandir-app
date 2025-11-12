/**
 * Panchang Service
 * Provides Hindu calendar data (Tithi, Nakshatra, Yoga, Karana, Auspicious Timings)
 */

import { Panchang, AuspiciousTiming } from '../types';
import { env } from '../config/env';

const PROKERALA_API_BASE = 'https://api.prokerala.com/v2';
const DEFAULT_LATITUDE = 28.6139; // Delhi coordinates
const DEFAULT_LONGITUDE = 77.2090;

/**
 * Get Panchang for a specific date and location
 */
export const getPanchang = async (
  date: Date = new Date(),
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): Promise<Panchang> => {
  try {
    // Try Prokerala API first if configured
    if (
      env.astrology.prokeralaClientId &&
      env.astrology.prokeralaClientId !== 'your_prokerala_client_id_here' &&
      env.astrology.prokeralaClientSecret &&
      env.astrology.prokeralaClientSecret !== 'your_prokerala_client_secret_here'
    ) {
      return await getPanchangFromProkerala(date, latitude, longitude);
    }

    // Fallback to mock data
    console.log('Prokerala API not configured, using fallback Panchang data');
    return getFallbackPanchang(date);
  } catch (error) {
    console.error('Error fetching Panchang:', error);
    return getFallbackPanchang(date);
  }
};

/**
 * Fetch Panchang from Prokerala API
 */
const getPanchangFromProkerala = async (
  date: Date,
  latitude: number,
  longitude: number
): Promise<Panchang> => {
  const dateStr = date.toISOString().split('T')[0];
  const url = `${PROKERALA_API_BASE}/astrology/panchang?coordinates=${latitude},${longitude}&datetime=${dateStr}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${env.astrology.prokeralaClientId}:${env.astrology.prokeralaClientSecret}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Prokerala API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.data) {
    throw new Error('Invalid response from Prokerala API');
  }

  const panchangData = data.data.panchang;

  return {
    date: dateStr,
    tithi: panchangData.tithi?.name || 'Unknown',
    nakshatra: panchangData.nakshatra?.name || 'Unknown',
    yoga: panchangData.yoga?.name || 'Unknown',
    karana: panchangData.karana?.name || 'Unknown',
    sunrise: panchangData.sunrise || '06:00',
    sunset: panchangData.sunset || '18:00',
    auspiciousTimings: getAuspiciousTimingsFromProkerala(panchangData),
  };
};

/**
 * Extract auspicious timings from Prokerala response
 */
const getAuspiciousTimingsFromProkerala = (panchangData: any): AuspiciousTiming[] => {
  const timings: AuspiciousTiming[] = [];

  // Add Abhijit Muhurat
  if (panchangData.abhijit_muhurat) {
    timings.push({
      name: 'Abhijit Muhurat',
      start: panchangData.abhijit_muhurat.start || '',
      end: panchangData.abhijit_muhurat.end || '',
    });
  }

  // Add Amrit Kaal
  if (panchangData.amrit_kaal) {
    timings.push({
      name: 'Amrit Kaal',
      start: panchangData.amrit_kaal.start || '',
      end: panchangData.amrit_kaal.end || '',
    });
  }

  // Add Brahma Muhurat
  if (panchangData.brahma_muhurat) {
    timings.push({
      name: 'Brahma Muhurat',
      start: panchangData.brahma_muhurat.start || '',
      end: panchangData.brahma_muhurat.end || '',
    });
  }

  // Add Rahu Kaal
  if (panchangData.rahu_kaal) {
    timings.push({
      name: 'Rahu Kaal',
      start: panchangData.rahu_kaal.start || '',
      end: panchangData.rahu_kaal.end || '',
    });
  }

  // Add Yamaganda
  if (panchangData.yamaganda) {
    timings.push({
      name: 'Yamaganda',
      start: panchangData.yamaganda.start || '',
      end: panchangData.yamaganda.end || '',
    });
  }

  return timings.length > 0 ? timings : getDefaultAuspiciousTimings();
};

/**
 * Get fallback Panchang data when API is unavailable
 */
const getFallbackPanchang = (date: Date): Panchang => {
  const day = date.getDate();
  const month = date.getMonth();

  // Simple mock data based on date
  const tithis = [
    'Prathama',
    'Dwitiya',
    'Tritiya',
    'Chaturthi',
    'Panchami',
    'Shashthi',
    'Saptami',
    'Ashtami',
    'Navami',
    'Dashami',
    'Ekadashi',
    'Dwadashi',
    'Trayodashi',
    'Chaturdashi',
    'Poornima',
    'Amavasya',
  ];

  const nakshatras = [
    'Ashwini',
    'Bharani',
    'Krittika',
    'Rohini',
    'Mrigashira',
    'Ardra',
    'Punarvasu',
    'Pushya',
    'Ashlesha',
    'Magha',
    'Purva Phalguni',
    'Uttara Phalguni',
    'Hasta',
    'Chitra',
    'Swati',
    'Vishakha',
    'Anuradha',
    'Jyeshtha',
    'Mula',
    'Purva Ashadha',
    'Uttara Ashadha',
    'Shravana',
    'Dhanishta',
    'Shatabhisha',
    'Purva Bhadrapada',
    'Uttara Bhadrapada',
    'Revati',
  ];

  const tithiIndex = day % tithis.length;
  const nakshatraIndex = (day + month) % nakshatras.length;

  return {
    date: date.toISOString().split('T')[0],
    tithi: tithis[tithiIndex],
    nakshatra: nakshatras[nakshatraIndex],
    yoga: 'Shubha',
    karana: 'Bava',
    sunrise: '06:30',
    sunset: '18:15',
    auspiciousTimings: getDefaultAuspiciousTimings(),
  };
};

/**
 * Get default auspicious timings
 */
const getDefaultAuspiciousTimings = (): AuspiciousTiming[] => {
  return [
    {
      name: 'Abhijit Muhurat',
      start: '11:45',
      end: '12:30',
    },
    {
      name: 'Brahma Muhurat',
      start: '04:30',
      end: '05:15',
    },
    {
      name: 'Amrit Kaal',
      start: '08:00',
      end: '09:30',
    },
    {
      name: 'Rahu Kaal',
      start: '09:00',
      end: '10:30',
    },
    {
      name: 'Yamaganda',
      start: '12:00',
      end: '13:30',
    },
  ];
};

