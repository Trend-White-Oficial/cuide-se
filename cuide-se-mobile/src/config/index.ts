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