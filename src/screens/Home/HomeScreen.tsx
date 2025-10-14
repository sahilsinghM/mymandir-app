import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../../theme/colors';
import DailyShlokaCard from '../../components/home/DailyShlokaCard';

const HomeScreen: React.FC = () => {
  const handleSaveVerse = (verse: any) => {
    // TODO: Implement save to favorites functionality
    console.log('Saving verse:', verse);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Daily Devotion</Text>
            <Text style={styles.subtitle}>Your spiritual journey begins here</Text>
            
            {/* Daily Shloka Card */}
            <DailyShlokaCard onSave={handleSaveVerse} />
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>What you'll find here:</Text>
              <View style={styles.featuresList}>
                <Text style={styles.feature}>• Daily Bhagavad Gita verses</Text>
                <Text style={styles.feature}>• AI-generated spiritual quotes</Text>
                <Text style={styles.feature}>• Personalized content based on your deity preference</Text>
                <Text style={styles.feature}>• Share and save your favorite verses</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    ...shadows.small,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 24,
  },
});

export default HomeScreen;
