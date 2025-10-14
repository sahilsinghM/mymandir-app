import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mock theme
const mockTheme = {
  colors: {
    primary: '#FF9933',
    secondary: '#FFFFFF',
    accent: '#FFD700',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: '#000000',
    notification: '#FF9933',
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
  roundness: 4,
};

// Mock AuthContext
const mockAuthContext = {
  user: null,
  loading: false,
  signInWithGoogle: jest.fn(),
  signInWithPhone: jest.fn(),
  signOut: jest.fn(),
  updateUserProfile: jest.fn(),
};

const AuthContext = React.createContext(mockAuthContext);

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={mockTheme}>
        <NavigationContainer>
          <AuthContext.Provider value={mockAuthContext}>
            {children}
          </AuthContext.Provider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };
export { mockAuthContext };
export { AuthContext };

// Basic test to ensure the module loads
describe('Test Utils', () => {
  it('should export render function', () => {
    expect(customRender).toBeDefined();
  });

  it('should export mock auth context', () => {
    expect(mockAuthContext).toBeDefined();
    expect(AuthContext).toBeDefined();
  });
});