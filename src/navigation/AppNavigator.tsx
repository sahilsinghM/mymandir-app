import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { ThemedText } from '../components/ui';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { HoroscopeScreen } from '../screens/Horoscope/HoroscopeScreen';
import { MantraPlayerScreen } from '../screens/MantraPlayer/MantraPlayerScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { PanchangScreen } from '../screens/Panchang/PanchangScreen';
import { GuidanceScreen } from '../screens/Guidance/GuidanceScreen';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator for authenticated users
const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Horoscope: 'planet',
  Panchang: 'calendar',
  Guidance: 'bulb',
  MantraPlayer: 'musical-notes',
  Profile: 'person-circle',
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textInverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          borderTopColor: theme.colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIcons[route.name as keyof MainTabParamList] || 'ellipse';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Horoscope"
        component={HoroscopeScreen}
        options={{
          title: 'Horoscope',
          tabBarLabel: 'Horoscope',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Panchang"
        component={PanchangScreen}
        options={{
          title: 'Panchang',
          tabBarLabel: 'Panchang',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Guidance"
        component={GuidanceScreen}
        options={{
          title: 'Spiritual Guidance',
          tabBarLabel: 'Guidance',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MantraPlayer"
        component={MantraPlayerScreen}
        options={{
          title: 'Mantras',
          tabBarLabel: 'Mantras',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator - handles auth flow
export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Debug logging for navigation
  React.useEffect(() => {
    console.log('🧭 Navigation State:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      loading,
    });
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.placeholder}>
        <ThemedText variant="body">Loading...</ThemedText>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.textInverse,
          headerTitleStyle: {
            fontWeight: theme.typography.weights.bold,
          },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ 
                title: 'Sign In',
                headerShown: true,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
