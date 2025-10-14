import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signInWithGoogle, signInWithPhone, loading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate('Onboarding');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      await signInWithPhone(phoneNumber);
      navigation.navigate('Onboarding');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with phone');
    }
  };

  const handleBack = () => {
    if (showPhoneInput) {
      setShowPhoneInput(false);
      setPhoneNumber('');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF9933', '#FFD700', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FF9933" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>
                Choose your preferred sign-in method
              </Text>
            </View>

            {/* Sign In Options */}
            <View style={styles.optionsContainer}>
              {!showPhoneInput ? (
                <>
                  {/* Google Sign In */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#4285F4', '#34A853']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Sign in with Google</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Phone Sign In */}
                  <TouchableOpacity
                    style={styles.phoneButton}
                    onPress={() => setShowPhoneInput(true)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FF9933', '#FFD700']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="call" size={24} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Sign in with Phone</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Phone Input */}
                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.inputLabel}>Enter your phone number</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="+91 9876543210"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      autoFocus
                    />
                    <TouchableOpacity
                      style={styles.continueButton}
                      onPress={handlePhoneSignIn}
                      disabled={loading || !phoneNumber.trim()}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FF9933', '#FFD700']}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.buttonText}>Continue</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            {/* Loading Indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 30,
    zIndex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF9933',
    fontWeight: '500',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9933',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
  },
  googleButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phoneButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  phoneInputContainer: {
    gap: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  phoneInput: {
    height: 60,
    borderWidth: 2,
    borderColor: '#FF9933',
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default LoginScreen;
