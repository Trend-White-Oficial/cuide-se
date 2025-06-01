import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  const getAvailableLanguages = useCallback(() => {
    return [
      { code: 'pt-BR', name: 'Português' },
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Español' },
    ];
  }, []);

  return {
    currentLanguage: getCurrentLanguage(),
    availableLanguages: getAvailableLanguages(),
    changeLanguage,
  };
}; 