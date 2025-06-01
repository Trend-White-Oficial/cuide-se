import {
  API_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  STORAGE_PREFIX,
  GOOGLE_MAPS_API_KEY,
  FIREBASE_CONFIG,
} from '@env';

interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  storage: {
    prefix: string;
  };
  app: {
    name: string;
    version: string;
    description: string;
  };
  services: {
    googleMaps: {
      apiKey: string;
    };
    firebase: {
      config: any;
    };
  };
}

const config: Config = {
  api: {
    baseUrl: API_URL || 'https://api.cuide-se.com',
    timeout: Number(API_TIMEOUT) || 10000, // 10 segundos
  },
  storage: {
    prefix: STORAGE_PREFIX || '@cuide-se:',
  },
  app: {
    name: APP_NAME || 'Cuide-Se',
    version: APP_VERSION || '1.0.0',
    description: APP_DESCRIPTION || 'Conectando você aos melhores profissionais de estética',
  },
  services: {
    googleMaps: {
      apiKey: GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
    },
    firebase: {
      config: FIREBASE_CONFIG ? JSON.parse(FIREBASE_CONFIG) : {
        apiKey: 'YOUR_FIREBASE_API_KEY',
        authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
        projectId: 'YOUR_FIREBASE_PROJECT_ID',
        storageBucket: 'YOUR_FIREBASE_STORAGE_BUCKET',
        messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
        appId: 'YOUR_FIREBASE_APP_ID',
      },
    },
  },
};

export default config;

// Configurações do App
export const APP_CONFIG = {
  name: 'Cuide-se',
  version: '1.0.0',
  buildNumber: '1',
  bundleId: 'com.cuidese.app',
};

// Configurações de API
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.cuidese.com',
  timeout: 30000,
  retryAttempts: 3,
};

// Configurações de Cache
export const CACHE_CONFIG = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  maxSize: 50 * 1024 * 1024, // 50MB
};

// Configurações de Notificações
export const NOTIFICATION_CONFIG = {
  channelId: 'default',
  channelName: 'Notificações',
  importance: 'high',
};

// Configurações de Tema
export const THEME_CONFIG = {
  primaryColor: '#2196f3',
  secondaryColor: '#f50057',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  errorColor: '#f44336',
  successColor: '#4caf50',
  warningColor: '#ff9800',
};

// Configurações de Idioma
export const LANGUAGE_CONFIG = {
  defaultLanguage: 'pt-BR',
  supportedLanguages: [
    { code: 'pt-BR', name: 'Português' },
    { code: 'en-US', name: 'English' },
    { code: 'es-ES', name: 'Español' },
  ],
};

// Configurações de Navegação
export const NAVIGATION_CONFIG = {
  initialRoute: 'Home',
  animationDuration: 300,
};

// Configurações de Formulários
export const FORM_CONFIG = {
  maxLength: {
    name: 100,
    email: 100,
    phone: 20,
    password: 50,
  },
  minLength: {
    password: 6,
  },
};

// Configurações de Validação
export const VALIDATION_CONFIG = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^\+?[1-9]\d{1,14}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
};

// Configurações de Paginação
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 50,
};

// Configurações de Upload
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  maxFiles: 5,
};

// Configurações de Analytics
export const ANALYTICS_CONFIG = {
  enabled: true,
  debug: __DEV__,
};

// Configurações de Performance
export const PERFORMANCE_CONFIG = {
  imageCacheSize: 100,
  listItemHeight: 80,
  animationFrameRate: 60,
};

// Configurações de Segurança
export const SECURITY_CONFIG = {
  tokenExpiration: 24 * 60 * 60 * 1000, // 24 horas
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
};

// Configurações de Acessibilidade
export const ACCESSIBILITY_CONFIG = {
  minimumTapArea: 44,
  minimumFontSize: 14,
  highContrast: false,
};

// Configurações de Debug
export const DEBUG_CONFIG = {
  enabled: __DEV__,
  logLevel: __DEV__ ? 'debug' : 'error',
  showErrors: __DEV__,
}; 