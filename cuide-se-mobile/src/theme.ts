import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF69B4',
    primaryLight: '#FFB6C1',
    secondary: '#F8F9FA',
    accent: '#FFC0CB',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#333333',
    error: '#FF4444',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

export const styles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness,
      padding: theme.spacing.md,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.roundness,
      padding: theme.spacing.md,
    },
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  text: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    h3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    body: {
      fontSize: 16,
      color: theme.colors.text,
    },
    caption: {
      fontSize: 14,
      color: theme.colors.placeholder,
    },
  },
}; 