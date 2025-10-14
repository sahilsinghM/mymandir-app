import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import ShlokaGenerator from '../../components/shloka/ShlokaGenerator';

const ShlokaGeneratorScreen: React.FC = () => {
  const handleShlokaGenerated = (shloka: any) => {
    console.log('Shloka generated:', shloka);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>AI Shloka Generator</Text>
          <Text style={styles.subtitle}>Personalized Sanskrit verses</Text>
          
          {/* Shloka Generator */}
          <ShlokaGenerator onShlokaGenerated={handleShlokaGenerated} />
        </View>
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
  content: {
    flex: 1,
    paddingTop: 20,
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
    marginBottom: 20,
  },
});

export default ShlokaGeneratorScreen;
