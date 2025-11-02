# How to Add DeepSeek API Key

Since editing `.env` is not possible, here are **3 ways** to add your DeepSeek API key:

## Method 1: Edit app.config.ts directly (EASIEST) ✅

Open `app.config.ts` and find line 59. Replace the empty string with your actual API key:

```typescript
deepseekApiKey: process.env.DEEPSEEK_API_KEY || 'sk-YOUR-ACTUAL-DEEPSEEK-API-KEY-HERE',
```

**Example:**
```typescript
deepseekApiKey: process.env.DEEPSEEK_API_KEY || 'sk-abc123def456...',
```

Then restart your development server.

## Method 2: Add via Terminal Command

Run this command in your terminal (replace `sk-YOUR-KEY` with your actual key):

```bash
cd /home/sahil/mycode/mandirapp/mandir-app
echo "DEEPSEEK_API_KEY=sk-YOUR-ACTUAL-KEY-HERE" >> .env
```

## Method 3: Edit .env file manually

1. Open the file: `/home/sahil/mycode/mandirapp/mandir-app/.env`
2. Add this line (or update if it exists):
   ```
   DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```
3. Save the file
4. Restart your development server

---

## Where to Get Your DeepSeek API Key

1. Visit: https://platform.deepseek.com/api_keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (it starts with `sk-`)

---

## Verification

After adding the key, restart your Expo dev server:
```bash
npm start
```

The DeepSeek model should appear in the AI Jyotish screen's model selector.

