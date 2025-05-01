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

export const testEnvVariables = () => {
  console.log('API URL:', API_URL);
  console.log('API Timeout:', API_TIMEOUT);
  console.log('App Name:', APP_NAME);
  console.log('App Version:', APP_VERSION);
  console.log('App Description:', APP_DESCRIPTION);
  console.log('Storage Prefix:', STORAGE_PREFIX);
  console.log('Google Maps API Key:', GOOGLE_MAPS_API_KEY);
  console.log('Firebase Config:', FIREBASE_CONFIG);
}; 