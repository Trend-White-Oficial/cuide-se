import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      welcome: 'Bem-vindo ao Cuide-se',
      schedule: 'Agendar',
      profile: 'Perfil',
      settings: 'Configurações'
    }
  },
  en: {
    translation: {
      welcome: 'Welcome to Cuide-se',
      schedule: 'Schedule',
      profile: 'Profile',
      settings: 'Settings'
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido a Cuide-se',
      schedule: 'Programar',
      profile: 'Perfil',
      settings: 'Configuraciones'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 