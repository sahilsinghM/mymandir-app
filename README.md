# MyMandir - Spiritual Journey App

A comprehensive React Native (Expo) app for spiritual engagement, astrology, and devotional experiences.

## 🌟 Features

### Core Features
- **Daily Devotion Feed** - AI-generated spiritual content with Bhagavad Gita verses
- **AI Jyotish** - Intelligent astrology chatbot powered by OpenAI
- **Horoscope & Panchang** - Daily astrology readings and auspicious timings
- **Temple Feed** - Virtual darshan and spiritual experiences
- **Mantra Player** - Audio playback with looping and favorites
- **AI Shloka Generator** - Generate Sanskrit verses based on emotions
- **Expert Jyotish Directory** - Connect with astrology experts
- **User Profile & Settings** - Personalized spiritual journey tracking
- **Push Notifications** - Daily reminders and streak tracking
- **Streak System** - Gamified spiritual practice tracking

### Technical Features
- **TypeScript** - Full type safety
- **Firebase Integration** - Authentication, Firestore, Storage
- **OpenAI Integration** - AI-powered content generation
- **Expo Notifications** - Push notification system
- **Expo AV** - Audio playback capabilities
- **Comprehensive Testing** - Jest + React Native Testing Library
- **Themed UI Components** - Saffron/gold design system
- **Responsive Design** - Works on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mandir-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Astrology API Configuration
   ASTRO_API_KEY=your_astro_api_key
   ```

4. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication (Google, Phone)
   - Set up Firestore database
   - Configure Storage
   - Add your app to the project

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Themed UI components
│   ├── home/           # Home screen components
│   ├── profile/        # Profile screen components
│   ├── mantra/         # Mantra player components
│   └── shloka/         # Shloka generator components
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── Home/           # Home screen
│   ├── Horoscope/      # Horoscope screen
│   ├── AIJyotish/      # AI Jyotish screen
│   ├── MantraPlayer/   # Mantra player screen
│   ├── TempleFeed/     # Temple feed screen
│   ├── ShlokaGenerator/ # Shloka generator screen
│   └── Profile/        # Profile screen
├── services/           # API and business logic
│   ├── firebase.ts     # Firebase configuration
│   ├── geetaApi.ts     # Bhagavad Gita API
│   ├── openaiService.ts # OpenAI integration
│   ├── astroService.ts # Astrology API
│   ├── notificationService.ts # Push notifications
│   └── streakService.ts # Streak tracking
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   └── useNotifications.ts # Notification and streak hooks
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── theme/              # Design system
│   ├── colors.ts       # Color palette
│   └── theme.ts        # Complete theme system
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── testUtils.ts    # Testing utilities
└── __tests__/          # Test files
    ├── components/     # Component tests
    ├── screens/        # Screen tests
    ├── services/       # Service tests
    └── utils/          # Utility tests
```

## 🎨 Design System

### Color Palette
- **Primary**: Saffron (#FF6F00)
- **Secondary**: White (#FFFFFF)
- **Accent**: Gold (#FFD700)
- **Background**: Cream (#FFF8E1)
- **Text**: Dark Gray (#2E2E2E)

### Typography
- **Primary Font**: System (iOS) / Roboto (Android)
- **Sanskrit Font**: Noto Sans Devanagari
- **Sizes**: 12px to 64px scale
- **Weights**: Light (300) to Black (900)

### Components
- **ThemedText** - Typography component with variants
- **ThemedButton** - Button component with multiple styles
- **ThemedCard** - Card component with elevation options
- **ThemedInput** - Input component with validation

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test src/__tests__/components/ui/UIComponents.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **Component Tests** - Test UI component rendering and behavior
- **Screen Tests** - Test screen functionality and navigation
- **Service Tests** - Test API integrations and business logic
- **Integration Tests** - Test complete user flows

## 📱 API Integrations

### Firebase
- **Authentication** - Google and Phone sign-in
- **Firestore** - User profiles and app data
- **Storage** - Media files and user uploads

### OpenAI
- **GPT-4** - AI Jyotish responses
- **Content Generation** - Spiritual quotes and insights

### Bhagavad Gita API
- **Random Verses** - Daily spiritual content
- **Specific Verses** - Search by chapter and verse

### Astrology APIs
- **Daily Horoscopes** - Zodiac sign predictions
- **Panchang** - Hindu calendar information
- **Auspicious Timings** - Best times for activities

## 🔔 Notifications

### Notification Types
- **Daily Devotion** - Morning spiritual content
- **Streak Reminders** - Evening motivation
- **Mantra Practice** - Meditation reminders
- **Horoscope Updates** - Daily astrology readings

### Configuration
```typescript
// Enable notifications
const { requestPermissions } = useNotifications();
await requestPermissions();

// Schedule custom notification
await NotificationService.scheduleNotification({
  title: 'Custom Title',
  body: 'Custom Message',
  trigger: { hour: 9, minute: 0, repeats: true }
});
```

## 📊 Streak System

### Features
- **Daily Tracking** - Track spiritual practice consistency
- **Achievements** - Unlock badges for milestones
- **Karma Points** - Earn points for engagement
- **Statistics** - View progress and history

### Implementation
```typescript
// Update user streak
const { updateStreak } = useStreak();
await updateStreak();

// Get streak data
const { streakData } = useStreak();
console.log(streakData.currentStreak);
```

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

### App Store Deployment
1. Configure app.json with proper bundle identifiers
2. Build production version
3. Submit to App Store Connect / Google Play Console
4. Configure push notifications for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Bhagavad Gita API** - For providing spiritual content
- **OpenAI** - For AI-powered features
- **Expo** - For the development platform
- **Firebase** - For backend services
- **React Native Community** - For excellent libraries

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**MyMandir** - Your daily dose of divinity 🌅