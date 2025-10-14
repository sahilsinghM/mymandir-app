# MyMandir Deployment Workflow

## Phase 1: Pre-Deployment Setup (1-2 days)

### 1.1 Environment Configuration
```bash
# 1. Create production environment file
cp .env .env.production

# 2. Update .env.production with real API keys
# - Firebase production project keys
# - OpenAI production API key
# - Astrology API production key

# 3. Update app.json with production values
# - Bundle identifiers
# - App names and descriptions
# - Icon and splash screen paths
```

### 1.2 Fix Critical Issues
```bash
# 1. Fix notification mocking in tests
# 2. Update test expectations to match actual components
# 3. Ensure all environment variables are properly configured
# 4. Test all critical user flows
```

### 1.3 API Integration
```bash
# 1. Set up Firebase production project
# 2. Configure OpenAI API with production key
# 3. Set up astrology API (Prokerala/Aztro)
# 4. Test all API integrations
```

## Phase 2: Build Preparation (1 day)

### 2.1 Asset Preparation
```bash
# 1. Create app icons (all sizes)
# - 1024x1024 (App Store)
# - 512x512 (Google Play)
# - 180x180 (iOS)
# - 192x192 (Android)

# 2. Create splash screens
# - iOS: 1242x2688, 1125x2436, 828x1792
# - Android: 1080x1920, 720x1280

# 3. Create notification icons
# - 24x24, 48x48 (Android)
# - 20x20, 40x40 (iOS)
```

### 2.2 Build Configuration
```bash
# 1. Update app.json for production
expo app:config

# 2. Configure build settings
# - iOS: Bundle identifier, provisioning profiles
# - Android: Package name, signing keys
# - Web: Domain configuration
```

## Phase 3: Testing & Quality Assurance (2-3 days)

### 3.1 Automated Testing
```bash
# 1. Run full test suite
npm test

# 2. Fix any remaining test failures
# 3. Ensure test coverage > 80%
npm test -- --coverage

# 4. Run linting
npm run lint
```

### 3.2 Manual Testing
```bash
# 1. Test on iOS Simulator
expo start --ios

# 2. Test on Android Emulator
expo start --android

# 3. Test on physical devices
expo start --tunnel

# 4. Test all user flows:
# - Authentication (Google/Phone)
# - Daily devotion feed
# - AI Jyotish chat
# - Horoscope reading
# - Mantra player
# - Shloka generator
# - Profile management
# - Push notifications
```

### 3.3 Performance Testing
```bash
# 1. Test app startup time
# 2. Test memory usage
# 3. Test network performance
# 4. Test battery usage
# 5. Test on low-end devices
```

## Phase 4: Build & Deploy (2-3 days)

### 4.1 Development Build
```bash
# 1. Create development build
expo build:ios --type development
expo build:android --type apk

# 2. Test development builds
# 3. Fix any build issues
# 4. Test on TestFlight/Internal Testing
```

### 4.2 Production Build
```bash
# 1. Create production build
expo build:ios --type production
expo build:android --type app-bundle

# 2. Submit to app stores
# - iOS: App Store Connect
# - Android: Google Play Console
```

### 4.3 Web Deployment
```bash
# 1. Build for web
expo build:web

# 2. Deploy to hosting
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - Firebase Hosting: firebase deploy
```

## Phase 5: Post-Deployment (1-2 days)

### 5.1 Monitoring Setup
```bash
# 1. Set up Firebase Analytics
# 2. Set up Crashlytics
# 3. Set up Performance Monitoring
# 4. Set up Push Notification Analytics
```

### 5.2 App Store Optimization
```bash
# 1. Optimize app store listings
# 2. Add screenshots and descriptions
# 3. Set up app store keywords
# 4. Configure app categories
```

### 5.3 User Feedback
```bash
# 1. Monitor app store reviews
# 2. Respond to user feedback
# 3. Track crash reports
# 4. Monitor performance metrics
```

## Phase 6: Maintenance & Updates (Ongoing)

### 6.1 Regular Updates
```bash
# 1. Weekly bug fixes
# 2. Monthly feature updates
# 3. Quarterly major updates
# 4. Annual app store reviews
```

### 6.2 Monitoring & Analytics
```bash
# 1. Daily crash monitoring
# 2. Weekly performance reviews
# 3. Monthly user analytics
# 4. Quarterly business metrics
```

## 🚨 Critical Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] Firebase production keys configured
- [ ] OpenAI API key set up
- [ ] Astrology API key configured
- [ ] All environment variables tested

### ✅ API Integrations
- [ ] Firebase Authentication working
- [ ] Firestore database configured
- [ ] OpenAI API responding
- [ ] Astrology API integrated
- [ ] Push notifications working

### ✅ Testing
- [ ] All critical tests passing
- [ ] Manual testing completed
- [ ] Performance testing done
- [ ] Security testing completed

### ✅ Build Configuration
- [ ] App icons and splash screens ready
- [ ] Bundle identifiers configured
- [ ] Signing keys set up
- [ ] App store metadata ready

### ✅ Deployment
- [ ] Development build tested
- [ ] Production build created
- [ ] App store submissions ready
- [ ] Web deployment configured

## 🔧 Quick Fix Commands

### Fix Test Issues
```bash
# 1. Fix notification mocking
npm test -- --testPathPattern="notificationService"

# 2. Fix component tests
npm test -- --testPathPattern="UIComponents"

# 3. Run specific failing tests
npm test -- --testNamePattern="should render without crashing"
```

### Fix Environment Issues
```bash
# 1. Check environment variables
expo config

# 2. Clear cache
expo start --clear

# 3. Reset Metro bundler
npx react-native start --reset-cache
```

### Fix Build Issues
```bash
# 1. Clear Expo cache
expo r -c

# 2. Clear node modules
rm -rf node_modules && npm install

# 3. Clear build cache
expo build:clear
```

## 📱 Platform-Specific Requirements

### iOS Deployment
- [ ] Apple Developer Account ($99/year)
- [ ] iOS App Store Connect account
- [ ] Xcode installed (for local builds)
- [ ] Provisioning profiles configured
- [ ] App Store review guidelines compliance

### Android Deployment
- [ ] Google Play Console account ($25 one-time)
- [ ] Android Studio installed (for local builds)
- [ ] Signing keys generated
- [ ] Google Play policies compliance
- [ ] Target SDK version updated

### Web Deployment
- [ ] Domain name registered
- [ ] SSL certificate configured
- [ ] CDN setup (optional)
- [ ] PWA configuration (optional)
- [ ] SEO optimization

## 🎯 Success Metrics

### Technical Metrics
- [ ] App crash rate < 1%
- [ ] App startup time < 3 seconds
- [ ] Memory usage < 100MB
- [ ] Battery usage optimized
- [ ] Network requests optimized

### Business Metrics
- [ ] User retention > 70% (Day 1)
- [ ] User retention > 30% (Day 7)
- [ ] User retention > 10% (Day 30)
- [ ] App store rating > 4.0
- [ ] User engagement > 5 minutes/session

---

**Total Estimated Time: 7-10 days**
**Critical Path: Environment Setup → Testing → Build → Deploy**
