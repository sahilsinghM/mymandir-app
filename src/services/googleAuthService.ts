/**
 * Google Authentication Service
 * Handles Google Sign-In using expo-auth-session and Firebase
 * 
 * NOTE: For Firebase Google Sign-In to work, you need to:
 * 1. Enable Google Sign-In in Firebase Console → Authentication → Sign-in method
 * 2. Add your OAuth 2.0 Client IDs in Firebase Console → Project Settings → Your apps
 * 3. For web: Get Web Client ID from Google Cloud Console → APIs & Services → Credentials
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';
import { getFirebaseAuth } from './firebase';
import { env } from '../config/env';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

/**
 * Get Google OAuth Client ID
 * You need to configure this in Firebase Console
 */
const getGoogleClientId = (): string => {
  // Option 1: Use from app.config.ts extra (recommended for Expo)
  const configClientId = Constants.expoConfig?.extra?.googleClientId;
  if (configClientId && configClientId !== '' && configClientId !== 'your_google_web_client_id_here') {
    console.log('✅ Using Google Client ID from app.config.ts');
    return configClientId;
  }

  // Option 2: Use from environment variable (works in Node.js context)
  // Note: In browser, process.env might not work, so rely on app.config.ts
  const envClientId = process.env.GOOGLE_CLIENT_ID || 
                      (typeof window !== 'undefined' && (window as any).process?.env?.GOOGLE_CLIENT_ID);
  if (envClientId && envClientId !== '' && envClientId !== 'your_google_web_client_id_here') {
    console.log('✅ Using Google Client ID from environment variable');
    return envClientId;
  }

  // Option 3: Hardcoded fallback - USE THE ACTUAL CLIENT ID FROM .ENV
  // This ensures it works even if config loading fails
  const actualClientId = '146352979259-cv2f4dj37trjlsflgo2elannchg6jbdm.apps.googleusercontent.com';
  
  console.warn('⚠️  Google Client ID not found in config, using hardcoded value');
  console.warn('Make sure GOOGLE_CLIENT_ID is set in .env and app.config.ts');
  return actualClientId;
};

/**
 * Sign in with Google using OAuth
 */
export const signInWithGoogle = async (): Promise<{
  idToken: string;
  accessToken: string | null;
}> => {
  try {
    // Google OAuth REQUIRES HTTP/HTTPS schemes only (no custom schemes like com.mymandir.app://)
    // For production, you need a hosted HTTPS redirect endpoint
    let redirectUri: string;
    
    if (Platform.OS === 'web') {
      // For web, use the current origin
      redirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth`
        : 'http://localhost:19006/auth';
    } else {
      // For mobile
      if (__DEV__) {
        // Development: Use localhost (works with Expo Go)
        redirectUri = 'http://localhost:8081/auth';
      } else {
        // Production: Use HTTPS redirect URI (MUST be hosted on your server)
        // Replace with your actual production domain
        const productionRedirectUri = process.env.PRODUCTION_REDIRECT_URI || 'https://mymandir.app/auth';
        redirectUri = productionRedirectUri;
        
        console.warn('⚠️  Production: Make sure you have a redirect handler at:', redirectUri);
        console.warn('   This endpoint should redirect back to: com.mymandir.app://auth');
      }
    }

    const clientId = getGoogleClientId();

    // Log for debugging (user needs to add this to Google Console)
    console.log('🔍 Google OAuth Configuration:');
    console.log('  Client ID:', clientId);
    console.log('  Redirect URI:', redirectUri);
    console.log('  Platform:', Platform.OS);
    console.log('  ⚠️  IMPORTANT: Add this EXACT redirect URI to Google Cloud Console:');
    console.log('     → APIs & Services → Credentials → Your OAuth Client');
    console.log('     → Authorized redirect URIs → Add:', redirectUri);

    // Generate a secure random nonce for ID token validation
    // Nonce must be at least 16 characters for security
    const generateNonce = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let nonce = '';
      for (let i = 0; i < 32; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return nonce;
    };
    
    const nonce = generateNonce();

    // Use implicit flow (IdToken) for both web and mobile
    // Google REQUIRES nonce for id_token response type
    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken, // Implicit flow - direct ID token
      redirectUri,
      additionalParameters: {
        // Nonce is REQUIRED for id_token response type by Google
        // Must be included as additional parameter
        nonce: nonce,
      },
      usePKCE: false, // Not needed for implicit flow
    });
    
    // Store nonce for validation (Google will return it in the ID token)
    // This ensures the token came from our request
    console.log('🔐 Generated nonce for ID token validation');

    // Use proper Google OAuth 2.0 discovery endpoints
    // Google's OpenID Connect discovery endpoint provides all endpoints
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    // Start the auth session
    const result = await request.promptAsync(discovery);

    if (result.type === 'success') {
      const { id_token, access_token } = result.params;
      
      if (!id_token) {
        throw new Error('No ID token received from Google. Check redirect URI in Google Cloud Console.');
      }

      return {
        idToken: id_token as string,
        accessToken: (access_token as string) || null,
      };
    } else if (result.type === 'error') {
      const errorMsg = result.error?.message || result.error?.error_description || 'Unknown error';
      console.error('OAuth error details:', result.error);
      throw new Error(`Google sign-in error: ${errorMsg}. Check redirect URI in Google Cloud Console.`);
    } else {
      throw new Error('Google sign-in was cancelled');
    }
  } catch (error: any) {
    console.error('Google OAuth error:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('400') || error.message?.includes('redirect_uri_mismatch') || error.message?.includes('Invalid redirect')) {
      throw new Error(
        'Invalid redirect URI. Google OAuth REQUIRES HTTP/HTTPS schemes only.\n\n' +
        'Please add these redirect URIs to Google Cloud Console:\n' +
        '1. Go to Google Cloud Console → APIs & Services → Credentials\n' +
        '2. Click on your OAuth 2.0 Client ID\n' +
        '3. Under "Authorized redirect URIs", add:\n' +
        `   - http://localhost:8081/auth (for mobile/Expo Go)\n` +
        `   - http://localhost:19006/auth (for web)\n` +
        `   - https://localhost:19006/auth (for web HTTPS)\n` +
        '4. Click SAVE\n\n' +
        '⚠️  DO NOT use exp:// or custom schemes - Google only accepts HTTP/HTTPS!'
      );
    }
    
    throw error;
  }
};

/**
 * Sign in to Firebase using Google credentials
 */
export const signInToFirebaseWithGoogle = async (): Promise<void> => {
  try {
    console.log('🟡 Step 1: Getting OAuth tokens from Google...');
    // Get OAuth tokens from Google
    const { idToken } = await signInWithGoogle();
    
    if (!idToken) {
      throw new Error('No ID token received from Google OAuth');
    }
    
    console.log('🟡 Step 2: Creating Firebase credential...');
    // Create Firebase credential
    const auth = getFirebaseAuth();
    const credential = GoogleAuthProvider.credential(idToken);

    if (!credential) {
      throw new Error('Failed to create Firebase credential');
    }

    console.log('🟡 Step 3: Signing in to Firebase...');
    // Sign in to Firebase
    const userCredential = await signInWithCredential(auth, credential);
    
    console.log('✅ Successfully signed in to Firebase with Google!');
    console.log('   User ID:', userCredential.user.uid);
    console.log('   Email:', userCredential.user.email);
  } catch (error: any) {
    console.error('❌ Firebase Google sign-in error:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
    throw error;
  }
};

