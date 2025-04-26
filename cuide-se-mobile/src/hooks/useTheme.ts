import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(false);

  const loadTheme = async () => {
    try {
      setIsLoading(true);
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      await AsyncStorage.setItem('@theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const setThemeValue = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setThemeValue,
    loadTheme,
  };
}; 