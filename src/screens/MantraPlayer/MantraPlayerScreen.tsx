import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import MantraPlayer from '../../components/mantra/MantraPlayer';

const MantraPlayerScreen: React.FC = () => {
  const handleMantraComplete = (mantra: any) => {
    console.log('Mantra completed:', mantra.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientLight, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Mantra Player</Text>
          <Text style={styles.subtitle}>Sacred sounds for your soul</Text>
          
          {/* Mantra Player */}
          <MantraPlayer onMantraComplete={handleMantraComplete} />
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

export default MantraPlayerScreen;
