export const colors = {
  primary: {
    main: '#007AFF',
    light: '#4DA3FF',
    dark: '#0055B3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#34C759',
    light: '#6CDB8C',
    dark: '#2A9D47',
    contrast: '#FFFFFF',
  },
  error: {
    main: '#FF3B30',
    light: '#FF6B63',
    dark: '#CC2F26',
    contrast: '#FFFFFF',
  },
  warning: {
    main: '#FF9500',
    light: '#FFB340',
    dark: '#CC7700',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#34C759',
    light: '#6CDB8C',
    dark: '#2A9D47',
    contrast: '#FFFFFF',
  },
  grey: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F8F9FA',
  },
  divider: '#E9ECEF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
}; 