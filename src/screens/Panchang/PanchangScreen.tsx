import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { Panchang, AuspiciousTiming } from '../../types';
import { getPanchang } from '../../services/panchangService';

export const PanchangScreen: React.FC = () => {
  const [panchang, setPanchang] = useState<Panchang | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    loadPanchang();
  }, [selectedDate]);

  const loadPanchang = async () => {
    try {
      setLoading(true);
      const data = await getPanchang(selectedDate);
      setPanchang(data);
    } catch (error) {
      console.error('Error loading Panchang:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderAuspiciousTiming = (timing: AuspiciousTiming, index: number) => (
    <View key={index} style={styles.timingItem}>
      <View style={styles.timingHeader}>
        <ThemedText variant="h4" style={styles.timingName}>
          {timing.name}
        </ThemedText>
      </View>
      <View style={styles.timingTimes}>
        <ThemedText variant="body" color="textSecondary">
          {timing.start} - {timing.end}
        </ThemedText>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
          Loading Panchang...
        </ThemedText>
      </View>
    );
  }

  if (!panchang) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText variant="body" color="error">
          Unable to load Panchang. Please try again.
        </ThemedText>
        <ThemedButton
          title="Retry"
          variant="primary"
          size="md"
          onPress={loadPanchang}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Date Header */}
      <ThemedCard style={styles.dateCard}>
        <ThemedText variant="h2" color="primary" style={styles.dateText}>
          {formatDate(selectedDate)}
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" style={styles.dateSubtext}>
          {panchang.date}
        </ThemedText>
      </ThemedCard>

      {/* Basic Panchang Info */}
      <ThemedCard style={styles.infoCard}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Panchang Details
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText variant="label" color="textSecondary" style={styles.infoLabel}>
            Tithi:
          </ThemedText>
          <ThemedText variant="body" weight="semiBold" style={styles.infoValue}>
            {panchang.tithi}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="label" color="textSecondary" style={styles.infoLabel}>
            Nakshatra:
          </ThemedText>
          <ThemedText variant="body" weight="semiBold" style={styles.infoValue}>
            {panchang.nakshatra}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="label" color="textSecondary" style={styles.infoLabel}>
            Yoga:
          </ThemedText>
          <ThemedText variant="body" weight="semiBold" style={styles.infoValue}>
            {panchang.yoga}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText variant="label" color="textSecondary" style={styles.infoLabel}>
            Karana:
          </ThemedText>
          <ThemedText variant="body" weight="semiBold" style={styles.infoValue}>
            {panchang.karana}
          </ThemedText>
        </View>
      </ThemedCard>

      {/* Sunrise/Sunset */}
      <ThemedCard style={styles.sunCard}>
        <View style={styles.sunRow}>
          <View style={styles.sunItem}>
            <ThemedText variant="caption" color="textSecondary">
              Sunrise
            </ThemedText>
            <ThemedText variant="h4" color="primary">
              {panchang.sunrise}
            </ThemedText>
          </View>
          <View style={styles.sunDivider} />
          <View style={styles.sunItem}>
            <ThemedText variant="caption" color="textSecondary">
              Sunset
            </ThemedText>
            <ThemedText variant="h4" color="primary">
              {panchang.sunset}
            </ThemedText>
          </View>
        </View>
      </ThemedCard>

      {/* Auspicious Timings */}
      <ThemedCard style={styles.timingsCard}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Auspicious Timings
        </ThemedText>
        <View style={styles.timingsList}>
          {panchang.auspiciousTimings.map((timing, index) => renderAuspiciousTiming(timing, index))}
        </View>
      </ThemedCard>

      {/* Info Note */}
      <ThemedCard style={styles.noteCard}>
        <ThemedText variant="caption" color="textSecondary" style={styles.noteText}>
          Note: Timings are approximate and may vary based on your location. For accurate Panchang,
          please configure Prokerala API credentials.
        </ThemedText>
      </ThemedCard>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
  },
  dateCard: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  dateText: {
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  dateSubtext: {
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    color: theme.colors.primary,
  },
  sunCard: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunDivider: {
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  timingsCard: {
    marginBottom: theme.spacing.lg,
  },
  timingsList: {
    marginTop: theme.spacing.md,
  },
  timingItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timingHeader: {
    marginBottom: theme.spacing.xs,
  },
  timingName: {
    color: theme.colors.primary,
  },
  timingTimes: {
    marginTop: theme.spacing.xs,
  },
  noteCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  noteText: {
    lineHeight: theme.typography.sizes.caption * theme.typography.lineHeights.relaxed,
  },
});

