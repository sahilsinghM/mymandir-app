import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface VirtualDiyaProps {
  onDiyaLit?: () => void;
  onDiyaExtinguished?: () => void;
}

export const VirtualDiya: React.FC<VirtualDiyaProps> = ({
  onDiyaLit,
  onDiyaExtinguished,
}) => {
  const [isLit, setIsLit] = useState(false);
  const [flameAnimation] = useState(new Animated.Value(0));
  const [glowAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isLit) {
      // Start flame animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(flameAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      flameAnimation.setValue(0);
      glowAnimation.setValue(0);
    }
  }, [isLit]);

  const handleToggleDiya = () => {
    if (isLit) {
      setIsLit(false);
      onDiyaExtinguished?.();
    } else {
      setIsLit(true);
      onDiyaLit?.();
    }
  };

  const flameScale = flameAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Diya Container */}
      <View style={styles.diyaContainer}>
        {/* Glow Effect */}
        {isLit && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
              },
            ]}
          />
        )}

        {/* Diya Base */}
        <View style={styles.diyaBase}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            style={styles.diyaGradient}
          >
            <View style={styles.diyaTop} />
            <View style={styles.diyaMiddle} />
            <View style={styles.diyaBottom} />
          </LinearGradient>
        </View>

        {/* Flame */}
        {isLit && (
          <Animated.View
            style={[
              styles.flameContainer,
              {
                transform: [{ scale: flameScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['#FF4500', '#FF6347', '#FFD700']}
              style={styles.flame}
            >
              <View style={styles.flameTop} />
              <View style={styles.flameMiddle} />
              <View style={styles.flameBottom} />
            </LinearGradient>
          </Animated.View>
        )}

        {/* Wick */}
        <View style={styles.wick} />
      </View>

      {/* Prayer Message */}
      {isLit && (
        <View style={styles.prayerContainer}>
          <Text style={styles.prayerText}>
            🙏 May this light illuminate your path and bring peace to your heart 🙏
          </Text>
        </View>
      )}

      {/* Control Button */}
      <TouchableOpacity
        style={[styles.controlButton, isLit && styles.controlButtonLit]}
        onPress={handleToggleDiya}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isLit ? ['#FF6347', '#FF4500'] : ['#FF9933', '#FFD700']}
          style={styles.buttonGradient}
        >
          <Ionicons
            name={isLit ? 'flame' : 'flame-outline'}
            size={24}
            color={colors.secondary}
          />
          <Text style={styles.buttonText}>
            {isLit ? 'Extinguish Diya' : 'Light Diya'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Temple Info */}
      <View style={styles.templeInfo}>
        <Text style={styles.templeTitle}>Virtual Temple</Text>
        <Text style={styles.templeSubtitle}>
          Light a diya and offer your prayers
        </Text>
        <Text style={styles.templeDescription}>
          Experience the peace and tranquility of a temple visit from the comfort of your home.
          Light a virtual diya and offer your prayers to the divine.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  diyaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFD700',
    top: -50,
    left: -50,
  },
  diyaBase: {
    width: 120,
    height: 80,
    borderRadius: 60,
    overflow: 'hidden',
    ...shadows.medium,
  },
  diyaGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  diyaTop: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  diyaMiddle: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  diyaBottom: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  wick: {
    position: 'absolute',
    top: -10,
    width: 4,
    height: 20,
    backgroundColor: '#8B4513',
    borderRadius: 2,
  },
  flameContainer: {
    position: 'absolute',
    top: -40,
    alignItems: 'center',
  },
  flame: {
    width: 30,
    height: 50,
    borderRadius: 15,
    overflow: 'hidden',
  },
  flameTop: {
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 7.5,
    marginHorizontal: 2,
  },
  flameMiddle: {
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 7.5,
    marginHorizontal: 4,
  },
  flameBottom: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    marginHorizontal: 6,
  },
  prayerContainer: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    ...shadows.small,
  },
  prayerText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  controlButton: {
    width: width * 0.8,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
    ...shadows.medium,
  },
  controlButtonLit: {
    ...shadows.large,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  templeInfo: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    ...shadows.small,
  },
  templeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  templeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  templeDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VirtualDiya;
