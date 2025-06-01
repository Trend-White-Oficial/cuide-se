import { useState, useEffect, useCallback, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useDevice } from './useDevice';
import { useStorage } from './useStorage';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { ThemeContext } from '../contexts/ThemeContext';
import { theme as defaultTheme } from '../theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: number;
  elevation: number;
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontFamily: {
      regular: 'Roboto-Regular',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
    },
  },
  borderRadius: 8,
  elevation: 2,
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    error: '#CF6679',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#64B5F6',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  borderRadius: lightTheme.borderRadius,
  elevation: lightTheme.elevation,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  const { theme, setTheme } = context;
  const { deviceState } = useDevice();
  const { getItem, setItem } = useStorage();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const systemColorScheme = useColorScheme();

  // Carrega o tema salvo
  const loadSavedTheme = useCallback(async (): Promise<void> => {
    try {
      const savedMode = await getItem<ThemeMode>('@CuideSe:themeMode');
      if (savedMode) {
        await setThemeMode(savedMode);
      } else {
        // Usa o tema do sistema
        await setThemeMode('system');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar tema'));
      await setThemeMode('system');
    }
  }, [getItem]);

  // Define o modo do tema
  const setThemeMode = useCallback(
    async (mode: ThemeMode): Promise<void> => {
      try {
        const newTheme = {
          ...(mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark')
            ? darkTheme
            : lightTheme),
          mode,
        };

        setTheme(newTheme);
        await setItem('@CuideSe:themeMode', mode);

        // Registra o evento
        await logEvent('theme_changed', {
          mode,
          system_color_scheme: systemColorScheme,
          device_theme: deviceState.systemName === 'iOS' ? 'iOS' : 'Android',
        });

        showToast({
          type: 'success',
          message: 'Tema alterado',
          description: `Agora o app está no tema ${mode === 'system' ? 'do sistema' : mode}`,
        });
      } catch (error) {
        console.error('Erro ao definir tema:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao definir tema'));
        showToast({
          type: 'error',
          message: 'Erro ao alterar tema',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [systemColorScheme, deviceState, setItem, logEvent, showToast, recordError]
  );

  // Alterna entre temas claro e escuro
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        background: {
          default: prevTheme.colors.background.default === '#FFFFFF' ? '#212529' : '#FFFFFF',
          paper: prevTheme.colors.background.paper === '#F8F9FA' ? '#343A40' : '#F8F9FA',
        },
        text: {
          primary: prevTheme.colors.text.primary === '#212529' ? '#FFFFFF' : '#212529',
          secondary: prevTheme.colors.text.secondary === '#6C757D' ? '#ADB5BD' : '#6C757D',
          disabled: prevTheme.colors.text.disabled === '#ADB5BD' ? '#6C757D' : '#ADB5BD',
        },
      },
    }));
  }, [setTheme]);

  // Verifica se o tema atual é escuro
  const isDarkTheme = useCallback((): boolean => {
    return theme.mode === 'dark' || (theme.mode === 'system' && systemColorScheme === 'dark');
  }, [theme.mode, systemColorScheme]);

  // Carrega o tema inicial
  useEffect(() => {
    loadSavedTheme();
  }, [loadSavedTheme]);

  // Atualiza o tema quando o esquema de cores do sistema muda
  useEffect(() => {
    if (theme.mode === 'system') {
      setTheme(prev => ({
        ...(systemColorScheme === 'dark' ? darkTheme : lightTheme),
        mode: 'system',
      }));
    }
  }, [systemColorScheme, theme.mode]);

  const setCustomTheme = useCallback(
    (customTheme: typeof defaultTheme) => {
      setTheme(customTheme);
    },
    [setTheme]
  );

  return {
    theme,
    setThemeMode,
    toggleTheme,
    isDarkTheme,
    setCustomTheme,
  };
}; 