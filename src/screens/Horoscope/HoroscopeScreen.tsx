import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { AstroService, Horoscope, Panchang, AuspiciousTimings } from '../../services/astroService';

const HoroscopeScreen: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [panchang, setPanchang] = useState<Panchang | null>(null);
  const [timings, setTimings] = useState<AuspiciousTimings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'horoscope' | 'panchang'>('horoscope');

  const zodiacSigns = AstroService.getZodiacSigns();

  useEffect(() => {
    loadData();
  }, [selectedSign]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [horoscopeData, panchangData, timingsData] = await Promise.all([
        AstroService.getDailyHoroscope(selectedSign),
        AstroService.getPanchang(),
        AstroService.getAuspiciousTimings()
      ]);
      
      setHoroscope(horoscopeData);
      setPanchang(panchangData);
      setTimings(timingsData);
    } catch (error) {
      console.error('Error loading astrology data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHoroscopeTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Zodiac Sign Selector */}
      <View style={styles.signSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {zodiacSigns.map((sign) => (
            <TouchableOpacity
              key={sign}
              style={[
                styles.signButton,
                selectedSign === sign && styles.selectedSignButton
              ]}
              onPress={() => setSelectedSign(sign)}
            >
              <Text style={[
                styles.signButtonText,
                selectedSign === sign && styles.selectedSignButtonText
              ]}>
                {sign}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Horoscope Content */}
      {horoscope && (
        <View style={styles.horoscopeCard}>
          <LinearGradient
            colors={[colors.cardBackground, colors.background]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Daily Horoscope</Text>
              <Text style={styles.cardSubtitle}>{horoscope.date}</Text>
            </View>

            <Text style={styles.prediction}>{horoscope.prediction}</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mood</Text>
                <Text style={styles.detailValue}>{horoscope.mood}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Compatibility</Text>
                <Text style={styles.detailValue}>{horoscope.compatibility}</Text>
              </View>
            </View>

            <View style={styles.luckySection}>
              <Text style={styles.luckyTitle}>Lucky Numbers</Text>
              <View style={styles.luckyNumbers}>
                {horoscope.luckyNumbers.map((number, index) => (
                  <View key={index} style={styles.luckyNumber}>
                    <Text style={styles.luckyNumberText}>{number}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.luckySection}>
              <Text style={styles.luckyTitle}>Lucky Colors</Text>
              <View style={styles.luckyColors}>
                {horoscope.luckyColors.map((color, index) => (
                  <View key={index} style={styles.luckyColor}>
                    <Text style={styles.luckyColorText}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </ScrollView>
  );

  const renderPanchangTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Panchang Card */}
      {panchang && (
        <View style={styles.panchangCard}>
          <LinearGradient
            colors={[colors.cardBackground, colors.background]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Panchang</Text>
              <Text style={styles.cardSubtitle}>{panchang.date}</Text>
            </View>

            <View style={styles.panchangGrid}>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Tithi</Text>
                <Text style={styles.panchangValue}>{panchang.tithi}</Text>
              </View>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Nakshatra</Text>
                <Text style={styles.panchangValue}>{panchang.nakshatra}</Text>
              </View>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Yoga</Text>
                <Text style={styles.panchangValue}>{panchang.yoga}</Text>
              </View>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Karana</Text>
                <Text style={styles.panchangValue}>{panchang.karana}</Text>
              </View>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Paksha</Text>
                <Text style={styles.panchangValue}>{panchang.paksha}</Text>
              </View>
              <View style={styles.panchangItem}>
                <Text style={styles.panchangLabel}>Ritu</Text>
                <Text style={styles.panchangValue}>{panchang.ritu}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Auspicious Timings */}
      {timings && (
        <View style={styles.timingsCard}>
          <LinearGradient
            colors={[colors.cardBackground, colors.background]}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Auspicious Timings</Text>
            </View>

            <View style={styles.timingsGrid}>
              <View style={styles.timingItem}>
                <Ionicons name="sunny" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Sunrise</Text>
                <Text style={styles.timingValue}>{timings.sunrise}</Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="moon" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Sunset</Text>
                <Text style={styles.timingValue}>{timings.sunset}</Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Moonrise</Text>
                <Text style={styles.timingValue}>{timings.moonrise}</Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="moon" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Moonset</Text>
                <Text style={styles.timingValue}>{timings.moonset}</Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Brahma Muhurat</Text>
                <Text style={styles.timingValue}>{timings.brahmaMuhurat}</Text>
              </View>
              <View style={styles.timingItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={styles.timingLabel}>Abhijit Muhurat</Text>
                <Text style={styles.timingValue}>{timings.abhijitMuhurat}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[colors.gradientLight, colors.background]}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading astrology data...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'horoscope' && styles.activeTabButton]}
            onPress={() => setActiveTab('horoscope')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'horoscope' && styles.activeTabButtonText]}>
              Horoscope
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'panchang' && styles.activeTabButton]}
            onPress={() => setActiveTab('panchang')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'panchang' && styles.activeTabButtonText]}>
              Panchang
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'horoscope' ? renderHoroscopeTab() : renderPanchangTab()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 4,
    ...shadows.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabButtonText: {
    color: colors.secondary,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  signSelector: {
    marginBottom: 20,
  },
  signButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: colors.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  selectedSignButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  signButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedSignButtonText: {
    color: colors.secondary,
  },
  horoscopeCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  panchangCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  timingsCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  prediction: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  luckySection: {
    marginBottom: 16,
  },
  luckyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  luckyNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  luckyNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  luckyNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  luckyColors: {
    flexDirection: 'row',
    gap: 8,
  },
  luckyColor: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  luckyColorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  panchangGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  panchangItem: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  panchangLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  panchangValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  timingsGrid: {
    gap: 16,
  },
  timingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    ...shadows.small,
  },
  timingLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  timingValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default HoroscopeScreen;
