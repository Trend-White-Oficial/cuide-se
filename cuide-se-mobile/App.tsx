import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { Navigation } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';

const AppContent = () => {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Navigation />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </ThemeProvider>
  );
}
