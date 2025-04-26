import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '../AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe('AppNavigator', () => {
  it('renderiza corretamente a navegação inicial', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    );

    expect(getByTestId('home-tab')).toBeTruthy();
    expect(getByTestId('search-tab')).toBeTruthy();
    expect(getByTestId('appointments-tab')).toBeTruthy();
    expect(getByTestId('profile-tab')).toBeTruthy();
  });

  it('navega entre as tabs corretamente', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    );

    fireEvent.press(getByTestId('search-tab'));
    expect(getByTestId('search-screen')).toBeTruthy();

    fireEvent.press(getByTestId('appointments-tab'));
    expect(getByTestId('appointments-screen')).toBeTruthy();

    fireEvent.press(getByTestId('profile-tab'));
    expect(getByTestId('profile-screen')).toBeTruthy();

    fireEvent.press(getByTestId('home-tab'));
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('redireciona para tela de autenticação quando não autenticado', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    );

    expect(getByTestId('auth-screen')).toBeTruthy();
  });
}); 