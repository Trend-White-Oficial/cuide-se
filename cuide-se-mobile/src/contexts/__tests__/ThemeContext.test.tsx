import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock do useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: () => 'light',
}));

// Componente de teste
const TestComponent = () => {
  const { theme, isDark, colors, toggleTheme, setTheme } = useTheme();
  return (
    <>
      <div testID="theme">{theme}</div>
      <div testID="isDark">{isDark.toString()}</div>
      <div testID="primary-color">{colors.primary}</div>
      <button testID="toggle-theme" onPress={toggleTheme}>
        Toggle Theme
      </button>
      <button testID="set-light" onPress={() => setTheme('light')}>
        Set Light
      </button>
      <button testID="set-dark" onPress={() => setTheme('dark')}>
        Set Dark
      </button>
      <button testID="set-system" onPress={() => setTheme('system')}>
        Set System
      </button>
    </>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com tema do sistema por padrão', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme').props.children).toBe('system');
    expect(getByTestId('isDark').props.children).toBe('false');
  });

  it('deve carregar tema salvo do AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getByTestId('theme').props.children).toBe('dark');
    expect(getByTestId('isDark').props.children).toBe('true');
  });

  it('deve alternar entre temas claro e escuro', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      getByTestId('toggle-theme').props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'dark');
    expect(getByTestId('theme').props.children).toBe('dark');
  });

  it('deve definir tema específico', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      getByTestId('set-dark').props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'dark');
    expect(getByTestId('theme').props.children).toBe('dark');
  });

  it('deve lançar erro quando useTheme é usado fora do ThemeProvider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme deve ser usado dentro de um ThemeProvider');

    console.error = consoleError;
  });

  it('deve aplicar cores corretas para cada tema', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Tema claro
    expect(getByTestId('primary-color').props.children).toBe('#007AFF');

    // Mudar para tema escuro
    act(() => {
      getByTestId('set-dark').props.onPress();
    });

    expect(getByTestId('primary-color').props.children).toBe('#0A84FF');
  });
}); 