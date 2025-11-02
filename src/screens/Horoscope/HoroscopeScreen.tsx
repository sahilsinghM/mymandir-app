import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { Horoscope, ZodiacSign } from '../../types';
import { getDailyHoroscope, getWeeklyHoroscope, getMonthlyHoroscope } from '../../services/astroService';

const zodiacSigns: ZodiacSign[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const HoroscopeScreen: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('Aries');
  const [horoscopeType, setHoroscopeType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHoroscope();
  }, [selectedSign, horoscopeType]);

  const loadHoroscope = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Horoscope;
      switch (horoscopeType) {
        case 'daily':
          data = await getDailyHoroscope(selectedSign);
          break;
        case 'weekly':
          data = await getWeeklyHoroscope(selectedSign);
          break;
        case 'monthly':
          data = await getMonthlyHoroscope(selectedSign);
          break;
      }
      setHoroscope(data);
    } catch (error: any) {
      console.error('Error loading horoscope:', error);
      setError(error.message || 'Failed to load horoscope');
      // Note: The service functions already return fallback data on error,
      // so we should still have a horoscope displayed
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedCard style={styles.pickerCard}>
        <ThemedText variant="label" style={styles.label}>
          Select Your Zodiac Sign
        </ThemedText>
        <View style={styles.signsGrid}>
          {zodiacSigns.map((sign) => (
            <ThemedButton
              key={sign}
              title={sign}
              variant={selectedSign === sign ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setSelectedSign(sign)}
              style={styles.signButton}
            />
          ))}
        </View>
      </ThemedCard>

      <View style={styles.typeButtons}>
        <ThemedButton
          title="Daily"
          variant={horoscopeType === 'daily' ? 'primary' : 'outline'}
          size="md"
          onPress={() => setHoroscopeType('daily')}
          style={styles.typeButton}
        />
        <ThemedButton
          title="Weekly"
          variant={horoscopeType === 'weekly' ? 'primary' : 'outline'}
          size="md"
          onPress={() => setHoroscopeType('weekly')}
          style={styles.typeButton}
        />
        <ThemedButton
          title="Monthly"
          variant={horoscopeType === 'monthly' ? 'primary' : 'outline'}
          size="md"
          onPress={() => setHoroscopeType('monthly')}
          style={styles.typeButton}
        />
      </View>

      {loading ? (
        <ThemedCard>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
              Loading horoscope...
            </ThemedText>
          </View>
        </ThemedCard>
      ) : horoscope ? (
        <ThemedCard style={styles.horoscopeCard}>
          <View style={styles.header}>
            <ThemedText variant="h2" color="primary">
              {horoscope.sign}
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary">
              {horoscopeType.charAt(0).toUpperCase() + horoscopeType.slice(1)} Horoscope
            </ThemedText>
            <ThemedText variant="caption" color="textLight">
              {horoscope.date}
            </ThemedText>
          </View>

          <View style={styles.predictionContainer}>
            <ThemedText variant="body" style={styles.prediction}>
              {horoscope.prediction}
            </ThemedText>
          </View>
          {error && (
            <ThemedText variant="caption" color="textSecondary" style={styles.errorText}>
              Note: Using fallback data. API may be unavailable.
            </ThemedText>
          )}
        </ThemedCard>
      ) : (
        <ThemedCard>
          <ThemedText variant="body" color="error">
            Unable to load horoscope. Please try again.
          </ThemedText>
        </ThemedCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  pickerCard: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  signsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  signButton: {
    flex: 1,
    minWidth: '30%',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
  },
  horoscopeCard: {
    marginTop: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.md,
  },
  predictionContainer: {
    marginTop: theme.spacing.md,
  },
  prediction: {
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
    textAlign: 'justify',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  errorText: {
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
});

