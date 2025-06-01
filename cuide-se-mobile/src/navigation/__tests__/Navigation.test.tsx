import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Navigation } from '../index';

// Mock das telas
jest.mock('../../screens/auth/LoginScreen', () => ({
  LoginScreen: () => <div testID="login-screen">Login Screen</div>,
}));

jest.mock('../../screens/main/HomeScreen', () => ({
  HomeScreen: () => <div testID="home-screen">Home Screen</div>,
}));

jest.mock('../../screens/main/AppointmentsScreen', () => ({
  AppointmentsScreen: () => <div testID="appointments-screen">Appointments Screen</div>,
}));

jest.mock('../../screens/main/ServicesScreen', () => ({
  ServicesScreen: () => <div testID="services-screen">Services Screen</div>,
}));

jest.mock('../../screens/main/ProfileScreen', () => ({
  ProfileScreen: () => <div testID="profile-screen">Profile Screen</div>,
}));

jest.mock('../../screens/main/SettingsScreen', () => ({
  SettingsScreen: () => <div testID="settings-screen">Settings Screen</div>,
}));

jest.mock('../../screens/main/HelpScreen', () => ({
  HelpScreen: () => <div testID="help-screen">Help Screen</div>,
}));

// Mock do contexto de autenticação
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
  }),
}));

describe('Navigation', () => {
  it('deve renderizar a tela de login quando não autenticado', () => {
    const { getByTestId } = render(<Navigation />);
    expect(getByTestId('login-screen')).toBeTruthy();
  });

  it('deve renderizar a navegação principal quando autenticado', () => {
    // Mock do contexto de autenticação para usuário autenticado
    jest.spyOn(require('../../contexts/AuthContext'), 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });

    const { getByTestId } = render(<Navigation />);
    expect(getByTestId('home-screen')).toBeTruthy();
  });

  it('deve navegar entre as abas corretamente', () => {
    // Mock do contexto de autenticação para usuário autenticado
    jest.spyOn(require('../../contexts/AuthContext'), 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });

    const { getByTestId } = render(<Navigation />);
    
    // Navegar para Agendamentos
    fireEvent.press(getByTestId('tab-appointments'));
    expect(getByTestId('appointments-screen')).toBeTruthy();

    // Navegar para Serviços
    fireEvent.press(getByTestId('tab-services'));
    expect(getByTestId('services-screen')).toBeTruthy();

    // Navegar para Perfil
    fireEvent.press(getByTestId('tab-profile'));
    expect(getByTestId('profile-screen')).toBeTruthy();
  });

  it('deve abrir o drawer e navegar para as telas corretamente', () => {
    // Mock do contexto de autenticação para usuário autenticado
    jest.spyOn(require('../../contexts/AuthContext'), 'useAuth').mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });

    const { getByTestId } = render(<Navigation />);
    
    // Abrir drawer
    fireEvent.press(getByTestId('drawer-button'));
    
    // Navegar para Configurações
    fireEvent.press(getByTestId('drawer-settings'));
    expect(getByTestId('settings-screen')).toBeTruthy();

    // Abrir drawer novamente
    fireEvent.press(getByTestId('drawer-button'));
    
    // Navegar para Ajuda
    fireEvent.press(getByTestId('drawer-help'));
    expect(getByTestId('help-screen')).toBeTruthy();
  });
}); 