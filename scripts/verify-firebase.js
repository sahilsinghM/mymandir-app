#!/usr/bin/env node

/**
 * Firebase Configuration Verification Script
 * Checks if Firebase credentials are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file in the project root.\n');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');

// Required Firebase variables
const requiredVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

console.log('📋 Checking required variables:\n');

let allConfigured = true;

requiredVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && match[1].trim() !== '' && !match[1].includes('your_')) {
    console.log(`✅ ${varName}: Configured`);
  } else {
    console.log(`❌ ${varName}: Not configured or using placeholder`);
    allConfigured = false;
  }
});

console.log('\n');

if (allConfigured) {
  console.log('✅ All Firebase variables are configured!');
  console.log('📱 Next steps:');
  console.log('   1. Restart your Expo server: npm start');
  console.log('   2. Try signing up with a test email');
  console.log('   3. Check Firebase Console → Authentication → Users');
  console.log('   4. Check Firebase Console → Firestore Database\n');
} else {
  console.log('❌ Some Firebase variables are missing or not configured.');
  console.log('📖 Please follow FIREBASE_SETUP.md to configure Firebase.\n');
  process.exit(1);
}

