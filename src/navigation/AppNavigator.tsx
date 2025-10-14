import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import HoroscopeScreen from '../screens/Horoscope/HoroscopeScreen';
import AIJyotishScreen from '../screens/AIJyotish/AIJyotishScreen';
import MantraPlayerScreen from '../screens/MantraPlayer/MantraPlayerScreen';
import TempleFeedScreen from '../screens/TempleFeed/TempleFeedScreen';
import ShlokaGeneratorScreen from '../screens/ShlokaGenerator/ShlokaGeneratorScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Import theme
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: colors.background },
    }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Horoscope':
            iconName = focused ? 'star' : 'star-outline';
            break;
          case 'AIJyotish':
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            break;
          case 'Mantra':
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            break;
          case 'Temple':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Shloka':
            iconName = focused ? 'book' : 'book-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.secondary,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Daily Devotion' }}
    />
    <Tab.Screen 
      name="Horoscope" 
      component={HoroscopeScreen}
      options={{ title: 'Horoscope' }}
    />
    <Tab.Screen 
      name="AIJyotish" 
      component={AIJyotishScreen}
      options={{ title: 'AI Jyotish' }}
    />
    <Tab.Screen 
      name="Mantra" 
      component={MantraPlayerScreen}
      options={{ title: 'Mantra Player' }}
    />
    <Tab.Screen 
      name="Temple" 
      component={TempleFeedScreen}
      options={{ title: 'Temple' }}
    />
    <Tab.Screen 
      name="Shloka" 
      component={ShlokaGeneratorScreen}
      options={{ title: 'Shloka' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Main App Navigator
export const AppNavigator: React.FC = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    // TODO: Add loading screen
    return null;
  }

  return (
    <NavigationContainer>
      {user && userProfile ? (
        <MainTabs />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
