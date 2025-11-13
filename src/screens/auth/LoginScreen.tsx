import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedButton, ThemedInput, ThemedCard } from '../../components/ui';
import { firebaseConfig, getFirebaseAuth } from '../../services/firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

type AuthMethod = 'phone' | 'email';

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const webRecaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const { signIn, signUp, signInAsGuest, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    try {
      const auth = getFirebaseAuth();
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'web-recaptcha-container', {
          size: 'invisible',
        });
        window.recaptchaVerifier.render();
      }
      webRecaptchaVerifier.current = window.recaptchaVerifier;
    } catch (error) {
      console.warn('Failed to initialize web reCAPTCHA', error);
    }
  }, []);

  const formatPhoneNumber = (): string | null => {
    const digits = phoneNumber.replace(/[^\d+]/g, '');
    if (!digits) {
      return null;
    }
    if (digits.startsWith('+')) {
      return digits;
    }
    return `+91${digits}`;
  };

  const handleSendOtp = async () => {
    const formattedPhone = formatPhoneNumber();
    if (!formattedPhone) {
      Alert.alert('Phone Required', 'Enter a valid phone number with country code.');
      return;
    }

    try {
      setLoading(true);
      setOtpCode('');
      const auth = getFirebaseAuth();
      let verifier: FirebaseRecaptchaVerifierModal | RecaptchaVerifier | null = null;

      if (Platform.OS === 'web') {
        verifier = webRecaptchaVerifier.current;
        if (!verifier) {
          Alert.alert('Verification Unavailable', 'reCAPTCHA is not ready yet. Please try again.');
          return;
        }
        await verifier.render();
      } else {
        verifier = recaptchaVerifier.current;
      }

      if (!verifier) {
        Alert.alert('Verification Unavailable', 'Unable to initialize the verifier. Try again shortly.');
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setOtpCountdown(60);
      Alert.alert('OTP Sent', `A verification code was sent to ${formattedPhone}`);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      Alert.alert('Missing OTP', 'Please request an OTP first.');
      return;
    }
    if (otpCode.length < 6) {
      Alert.alert('Invalid Code', 'Enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      await confirmationResult.confirm(otpCode);
      setOtpCode('');
      setOtpSent(false);
      setConfirmationResult(null);
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      Alert.alert('Verification Failed', error?.message || 'Incorrect code, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('🔘 handleSubmit called', { email, passwordLength: password.length, isSignUp });
    
    if (!email || !password) {
      console.warn('⚠️ Validation failed: Missing email or password');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      console.warn('⚠️ Validation failed: Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      console.log('✅ Validation passed, starting auth process...');
      setLoading(true);
      console.log(`📝 ${isSignUp ? 'Sign-up' : 'Sign-in'} attempt:`, { email, isSignUp, passwordLength: password.length });
      
      if (isSignUp) {
        console.log('📝 Calling signUp function...');
        await signUp(email, password);
        console.log('✅ Sign-up successful, user should be navigated automatically');
        // Don't show alert - navigation happens automatically via AuthContext
      } else {
        console.log('📝 Calling signIn function...');
        await signIn(email, password);
        console.log('✅ Sign-in successful, user should be navigated automatically');
      }
    } catch (error: any) {
      console.error('❌ Auth error caught in handleSubmit:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      console.log('🔚 handleSubmit finally block - setting loading to false');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Success - user will be navigated automatically by AuthContext
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const isPhoneFlow = authMethod === 'phone';
  const pageTitle = isPhoneFlow
    ? 'Verify Your Phone'
    : isSignUp
      ? 'Create Account'
      : 'Welcome Back';
  const pageSubtitle = isPhoneFlow
    ? 'Sign in quickly with a secure OTP sent to your number'
    : isSignUp
      ? 'Sign up to start your spiritual journey'
      : 'Sign in to continue your journey';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {Platform.OS !== 'web' && (
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig as any}
          attemptInvisibleVerification
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <ThemedText variant="h2" style={styles.title}>
            {pageTitle}
          </ThemedText>
          <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
            {pageSubtitle}
          </ThemedText>

          <View style={styles.authToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, isPhoneFlow && styles.toggleButtonActive]}
              onPress={() => setAuthMethod('phone')}
            >
              <ThemedText
                variant="body"
                color={isPhoneFlow ? 'textInverse' : 'text'}
                weight={isPhoneFlow ? 'semiBold' : 'regular'}
              >
                Phone OTP
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isPhoneFlow && styles.toggleButtonActive]}
              onPress={() => setAuthMethod('email')}
            >
              <ThemedText
                variant="body"
                color={!isPhoneFlow ? 'textInverse' : 'text'}
                weight={!isPhoneFlow ? 'semiBold' : 'regular'}
              >
                Email & Password
              </ThemedText>
            </TouchableOpacity>
          </View>

          {isPhoneFlow ? (
            <ThemedCard style={styles.formCard}>
              <ThemedInput
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
                helperText="Include country code (e.g., +91) to receive OTP"
              />

              {Platform.OS === 'web' && (
                <View id="web-recaptcha-container" style={styles.webRecaptchaContainer} />
              )}

              <ThemedButton
                title={otpSent ? (otpCountdown > 0 ? `Resend OTP in ${otpCountdown}s` : 'Resend OTP') : 'Send OTP'}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading || (otpSent && otpCountdown > 0)}
                onPress={handleSendOtp}
                style={styles.submitButton}
              />

              {otpSent && (
                <>
                  <ThemedInput
                    label="Verification Code"
                    placeholder="Enter 6-digit OTP"
                    keyboardType="number-pad"
                    value={otpCode}
                    onChangeText={setOtpCode}
                    maxLength={6}
                    autoComplete="sms-otp"
                  />
                  <ThemedButton
                    title="Verify & Continue"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                    onPress={handleVerifyOtp}
                  />
                </>
              )}
            </ThemedCard>
          ) : (
            <ThemedCard style={styles.formCard}>
              <ThemedInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <ThemedInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isSignUp ? 'password-new' : 'password'}
              />

              <ThemedButton
                title={isSignUp ? 'Sign Up' : 'Sign In'}
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                onPress={() => {
                  console.log('🔘 Sign Up/In button pressed', { email, isSignUp, loading });
                  handleSubmit();
                }}
                style={styles.submitButton}
              />

              <ThemedButton
                title={`Sign ${isSignUp ? 'In' : 'Up'} Instead`}
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => setIsSignUp(!isSignUp)}
                style={styles.switchButton}
              />
            </ThemedCard>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText variant="caption" color="textSecondary">
              OR
            </ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <ThemedButton
            title="Continue with Google"
            variant="outline"
            size="lg"
            fullWidth
            onPress={handleGoogleSignIn}
            disabled={loading}
          />

          <ThemedButton
            title="Continue as Guest"
            variant="ghost"
            size="md"
            fullWidth
            onPress={signInAsGuest}
            style={styles.guestButton}
          />
          
          <ThemedButton
            title="Back to Welcome"
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  authToggle: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  switchButton: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  guestButton: {
    marginTop: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.sm,
  },
  webRecaptchaContainer: {
    height: 1,
    width: 1,
    opacity: 0,
  },
});
