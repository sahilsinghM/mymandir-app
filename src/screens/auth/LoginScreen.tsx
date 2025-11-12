import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedButton, ThemedInput, ThemedCard } from '../../components/ui';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAsGuest, signInWithGoogle } = useAuth();

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <ThemedText variant="h2" style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </ThemedText>
          <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
            {isSignUp
              ? 'Sign up to start your spiritual journey'
              : 'Sign in to continue your journey'}
          </ThemedText>

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
});

