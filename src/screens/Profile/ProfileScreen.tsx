import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileSettings from '../../components/profile/ProfileSettings';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileSettings />
    </SafeAreaView>
  );
};

export default ProfileScreen;