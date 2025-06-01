import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { THEME_CONFIG } from '../config';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: typeof THEME_CONFIG;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const useTheme = (): ThemeContextData => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const handleSetThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  return {
    theme: THEME_CONFIG,
    themeMode,
    setThemeMode: handleSetThemeMode,
    isDark,
  };
}; 