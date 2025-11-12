# 🔧 Fix: Add Redirect URI to Google Cloud Console

## Current Error
**Error 400: redirect_uri_mismatch**

The redirect URI `http://localhost:8081/auth` is **NOT** registered in your Google Cloud Console.

## ✅ Step-by-Step Fix

### Step 1: Open Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **`mandir-3e41e`**

### Step 2: Navigate to OAuth Credentials
1. Click on **☰ Menu** (top left)
2. Go to **APIs & Services** → **Credentials**
3. Find your **OAuth 2.0 Client ID**: 
   ```
   146352979259-cv2f4dj37trjlsflgo2elannchg6jbdm.apps.googleusercontent.com
   ```
4. **Click on it** to edit

### Step 3: Add Redirect URI
1. Scroll down to **"Authorized redirect URIs"**
2. Click **"+ ADD URI"** button
3. Add **ALL** of these URIs (one by one):
   ```
   http://localhost:8081/auth
   http://localhost:8082/auth
   http://localhost:19006/auth
   ```
   ⚠️ **IMPORTANT:** 
   - Copy them exactly - no trailing slashes, no typos!
   - Add ALL three to cover different ports
   - The app uses `window.location.origin` which adapts to your browser port

4. Click **"ADD"** after each one

### Step 4: Save
1. Scroll to the bottom
2. Click **"SAVE"** button
3. Wait for "Credentials updated" message

### Step 5: Test Again
1. Wait 1-2 minutes for changes to propagate
2. Refresh your browser
3. Try Google Sign-In again

## 📋 Complete List of Redirect URIs to Add

Add all of these to cover different scenarios:

```
http://localhost:8081/auth
http://localhost:19006/auth
https://localhost:19006/auth
```

**Note:** The first one (`http://localhost:8081/auth`) is the one currently being used.

## 🎯 Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Selected project: `mandir-3e41e`
- [ ] Went to APIs & Services → Credentials
- [ ] Clicked on OAuth Client ID
- [ ] Added `http://localhost:8081/auth` to Authorized redirect URIs
- [ ] Clicked SAVE
- [ ] Waited 1-2 minutes
- [ ] Tested Google Sign-In again

## 🔍 Verify Redirect URI

After adding, you should see it listed like this:

```
Authorized redirect URIs
  ✅ http://localhost:8081/auth
```

## ❌ Common Mistakes

1. **Trailing slash:** `http://localhost:8081/auth/` ❌ (wrong - has trailing slash)
2. **HTTPS instead of HTTP:** `https://localhost:8081/auth` ❌ (wrong - must match exactly)
3. **Wrong port:** `http://localhost:8082/auth` ❌ (wrong - must be 8081)
4. **Missing /auth:** `http://localhost:8081` ❌ (wrong - must include /auth)

## 📚 Reference

[Google OAuth 2.0 Redirect URI Documentation](https://developers.google.com/identity/protocols/oauth2/web-server#authorization-errors-redirect-uri-mismatch)

