# Production Google OAuth Redirect URI Setup

## The Challenge

Google OAuth **REQUIRES HTTP/HTTPS schemes only** - it does NOT accept:
- ❌ Custom schemes like `com.mymandir.app://auth`
- ❌ Expo schemes like `exp://`

For production Android apps, you have **two main options**:

---

## Option 1: Use HTTPS Redirect URI (Recommended)

### Setup a Public Redirect Endpoint

1. **Host a simple redirect page** on your server (e.g., Firebase Hosting, Vercel, Netlify)

2. **Create redirect page** (`https://yourdomain.com/auth` or `https://mymandir.app/auth`):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Redirecting...</title>
   </head>
   <body>
     <script>
       // Extract OAuth params from URL
       const urlParams = new URLSearchParams(window.location.search);
       const idToken = urlParams.get('id_token');
       const accessToken = urlParams.get('access_token');
       const code = urlParams.get('code');
       
       // Redirect back to app with custom scheme
       if (idToken || code) {
         const redirectUrl = `com.mymandir.app://auth?${window.location.search}`;
         window.location.href = redirectUrl;
       }
     </script>
     <p>Redirecting to app...</p>
   </body>
   </html>
   ```

3. **Add HTTPS redirect URI to Google Cloud Console:**
   ```
   https://yourdomain.com/auth
   https://mymandir.app/auth
   ```

4. **Update app code** to use production redirect URI:
   ```typescript
   const redirectUri = __DEV__ 
     ? 'http://localhost:8081/auth'
     : 'https://yourdomain.com/auth';
   ```

### Advantages:
- ✅ Works with Google OAuth requirements
- ✅ Secure (HTTPS)
- ✅ Works for all platforms

---

## Option 2: Use Firebase's Built-in Google Sign-In (Easier)

Firebase provides a simpler Google Sign-In that handles redirects automatically.

### Implementation:

Instead of using `expo-auth-session`, use Firebase's popup-based Google Sign-In:

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// For web
const signInToFirebaseWithGoogle = async () => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // Done!
};
```

For mobile, use Firebase's native Google Sign-In:
- Requires `@react-native-google-signin/google-signin` package
- Handles OAuth flow automatically
- No redirect URI configuration needed

### Advantages:
- ✅ No redirect URI setup needed
- ✅ Firebase handles everything
- ✅ Works seamlessly

---

## Recommended Production Setup

For **production Android app**, use **Option 2** (Firebase's built-in Google Sign-In) because:

1. **Simpler** - No redirect URI management
2. **More reliable** - Firebase handles OAuth flow
3. **Better UX** - Native Google Sign-In experience
4. **Cross-platform** - Works on iOS too

### Quick Implementation:

1. Install package:
   ```bash
   npx expo install @react-native-google-signin/google-signin
   ```

2. Update `googleAuthService.ts` to use Firebase's native Google Sign-In for production
3. Keep current `expo-auth-session` approach for development/web

---

## Current Production Redirect URIs

If you want to stick with the current approach, add these **HTTPS redirect URIs** to Google Cloud Console:

```
https://mymandir.app/auth
https://www.mymandir.app/auth
https://your-production-domain.com/auth
```

**Note:** Replace `your-production-domain.com` with your actual hosted domain.

---

## Summary

- **Development:** Use `http://localhost:8081/auth`
- **Web:** Use `http://localhost:19006/auth` or your web domain
- **Production Android:** 
  - Option A: Use HTTPS redirect URI on your domain
  - Option B: Use Firebase's native Google Sign-In (recommended)

Choose Option B for the simplest production setup! 🎯



