import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  Home: undefined;
  Horoscope: undefined;
  Panchang: undefined;
  Guidance: undefined;
  MantraPlayer: undefined;
  Profile: undefined;
};
