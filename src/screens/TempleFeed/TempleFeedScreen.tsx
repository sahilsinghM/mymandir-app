import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../../theme/colors';
import VirtualDiya from '../../components/temple/VirtualDiya';

const TempleFeedScreen: React.FC = () => {
  const handleDiyaLit = () => {
    console.log('Diya lit!');
  };

  const handleDiyaExtinguished = () => {
    console.log('Diya extinguished!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Temple Feed</Text>
            <Text style={styles.subtitle}>Virtual spiritual experience</Text>
            
            {/* Virtual Diya */}
            <VirtualDiya 
              onDiyaLit={handleDiyaLit}
              onDiyaExtinguished={handleDiyaExtinguished}
            />
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>What you'll find here:</Text>
              <View style={styles.featuresList}>
                <Text style={styles.feature}>• Virtual diya lighting</Text>
                <Text style={styles.feature}>• Prayer offerings</Text>
                <Text style={styles.feature}>• Temple darshan videos</Text>
                <Text style={styles.feature}>• Spiritual quotes and messages</Text>
                <Text style={styles.feature}>• Meditation guidance</Text>
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

export default TempleFeedScreen;
