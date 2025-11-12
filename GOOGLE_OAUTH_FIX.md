# Fixing Google OAuth 400 Error

## The Problem

Getting a 400 error when testing Google Sign-In usually means:

1. **Redirect URI mismatch** - The redirect URI used by the app doesn't match what's configured in Google Cloud Console
2. **Client ID not matching** - Wrong Client ID being used
3. **OAuth consent screen not configured** - Required settings missing

## Solution: Add Redirect URIs to Google Cloud Console

### Step 1: Get Your Redirect URIs

When you click "Continue with Google" in the app, check the console logs. You'll see:

```
🔍 Google OAuth Configuration:
  Client ID: 146352979259-cv2f4dj37trjlsflgo2elannchg6jbdm.apps.googleusercontent.com
  Redirect URI: exp://127.0.0.1:8088
```

### Step 2: Add Redirect URIs to Google Cloud Console

⚠️ **IMPORTANT:** Google OAuth **REQUIRES HTTP/HTTPS schemes only**. Do NOT use `exp://` or custom schemes like `com.mymandir.app://`.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `mandir-3e41e`
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID: `146352979259-cv2f4dj37trjlsflgo2elannchg6jbdm.apps.googleusercontent.com`
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Add these URIs (one by one):

   **For Mobile/Expo Go (Development):**
   ```
   http://localhost:8081/auth
   ```

   **For Web (browser testing):**
   ```
   http://localhost:19006/auth
   https://localhost:19006/auth
   ```

7. Click **SAVE**

**Note:** These HTTP localhost URIs work with Expo's OAuth handling. The `exp://` and custom schemes are NOT accepted by Google OAuth.

---

## Production Android App Redirect URI

For **production builds**, you need an **HTTPS redirect URI** hosted on your server.

### Production Redirect URI Options:

**Option 1: HTTPS Redirect URI (Current Setup)**
- Production URI: `https://yourdomain.com/auth`
- Example: `https://mymandir.app/auth`
- **Requirements:**
  - Must be hosted on your server (Firebase Hosting, Vercel, Netlify, etc.)
  - Must have a redirect handler that redirects back to `com.mymandir.app://auth` with OAuth params
- **Add to Google Cloud Console:** `https://yourdomain.com/auth`

**Option 2: Firebase Native Google Sign-In (Recommended for Production)**
- No redirect URI needed
- Firebase handles OAuth flow automatically
- Better UX and more reliable
- See `PRODUCTION_GOOGLE_OAUTH.md` for implementation details

### Configuration:

Add to your `.env` file:
```env
PRODUCTION_REDIRECT_URI=https://yourdomain.com/auth
```

Or set it directly in `googleAuthService.ts`:
```typescript
const productionRedirectUri = 'https://mymandir.app/auth';
```

**Important:** 
- Replace `yourdomain.com` with your actual production domain
- The redirect endpoint must be publicly accessible via HTTPS
- The endpoint should extract OAuth tokens and redirect to `com.mymandir.app://auth?token=...`

### Step 3: Verify OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Make sure:
   - User type is selected (Internal or External)
   - App name is set
   - Support email is set
   - Developer contact information is added
3. Click **SAVE AND CONTINUE**

### Step 4: Test Again

1. Restart Expo server: `npm start`
2. Try Google Sign-In again
3. Check console logs for the exact redirect URI being used
4. Make sure that exact URI is in Google Cloud Console

## Quick Fix Script

Run this to see your redirect URI:

```bash
cd /home/sahil/mycode/mandirapp/mandir-app
node -e "const AuthSession = require('expo-auth-session'); console.log('Redirect URI:', AuthSession.makeRedirectUri({ scheme: 'com.mymandir.app', path: 'auth' }));"
```

Then add that exact URI to Google Cloud Console.

## Alternative: Use Firebase's Built-in Google Sign-In

If OAuth redirect continues to be problematic, we can switch to using Firebase's built-in Google Sign-In provider, which handles redirects automatically.

---

**Most Common Issue:** The redirect URI in the error message doesn't match what's in Google Cloud Console. Make sure they match EXACTLY (including scheme, path, and port).
