import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../types/firestore';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

const DEITIES = [
  { id: 'Krishna', name: 'Krishna', icon: '🕉️' },
  { id: 'Shiva', name: 'Shiva', icon: '🔱' },
  { id: 'Ganesha', name: 'Ganesha', icon: '🐘' },
  { id: 'Hanuman', name: 'Hanuman', icon: '🐒' },
  { id: 'Durga', name: 'Durga', icon: '🦁' },
  { id: 'Rama', name: 'Rama', icon: '🏹' },
];

const LANGUAGES = [
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'hindi', name: 'Hindi', flag: '🇮🇳' },
  { id: 'sanskrit', name: 'Sanskrit', flag: '📜' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { user, createUserProfile, loading } = useAuth();
  const [selectedDeity, setSelectedDeity] = useState('Krishna');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const handleFinish = async () => {
    if (!user) {
      Alert.alert('Error', 'No user found');
      return;
    }

    try {
      await createUserProfile({
        deityPreference: selectedDeity,
        language: selectedLanguage as 'english' | 'hindi' | 'sanskrit',
        birthDate: birthDate || undefined,
        birthTime: birthTime || undefined,
        birthPlace: birthPlace || undefined,
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile');
    }
  };

  const renderDeityOption = (deity: typeof DEITIES[0]) => (
    <TouchableOpacity
      key={deity.id}
      style={[
        styles.optionButton,
        selectedDeity === deity.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedDeity(deity.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.optionIcon}>{deity.icon}</Text>
      <Text
        style={[
          styles.optionText,
          selectedDeity === deity.id && styles.selectedOptionText,
        ]}
      >
        {deity.name}
      </Text>
    </TouchableOpacity>
  );

  const renderLanguageOption = (language: typeof LANGUAGES[0]) => (
    <TouchableOpacity
      key={language.id}
      style={[
        styles.optionButton,
        selectedLanguage === language.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedLanguage(language.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.optionIcon}>{language.flag}</Text>
      <Text
        style={[
          styles.optionText,
          selectedLanguage === language.id && styles.selectedOptionText,
        ]}
      >
        {language.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF9933', '#FFD700', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FF9933" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us personalize your spiritual journey
              </Text>
            </View>

            {/* Deity Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Preferred Deity</Text>
              <View style={styles.optionsGrid}>
                {DEITIES.map(renderDeityOption)}
              </View>
            </View>

            {/* Language Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Language</Text>
              <View style={styles.optionsGrid}>
                {LANGUAGES.map(renderLanguageOption)}
              </View>
            </View>

            {/* Birth Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Birth Details (Optional)</Text>
              <Text style={styles.sectionSubtitle}>
                This helps us provide accurate astrological guidance
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Birth Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  value={birthDate}
                  onChangeText={setBirthDate}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Birth Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM AM/PM"
                  value={birthTime}
                  onChangeText={setBirthTime}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Birth Place</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City, State, Country"
                  value={birthPlace}
                  onChangeText={setBirthPlace}
                />
              </View>
            </View>

            {/* Finish Button */}
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinish}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF9933', '#FFD700']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creating Profile...' : 'Finish'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9933',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    justifyContent: 'center',
  },
  selectedOption: {
    borderColor: '#FF9933',
    backgroundColor: '#FFF8F0',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedOptionText: {
    color: '#FF9933',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default OnboardingScreen;
