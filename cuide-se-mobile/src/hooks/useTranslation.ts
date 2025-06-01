import { useCallback } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS } from '../config/translations';

type Language = 'pt-BR' | 'en-US';

interface TranslationContextData {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
  isRTL: boolean;
}

export const useTranslation = (): TranslationContextData => {
  const language = 'pt-BR' as Language; // Por enquanto fixo em português
  const isRTL = I18nManager.isRTL;

  const setLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('@CuideSe:language', newLanguage);
      I18nManager.allowRTL(newLanguage === 'ar');
      I18nManager.forceRTL(newLanguage === 'ar');
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let translation: any = TRANSLATIONS[language];

    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(`Tradução não encontrada para a chave: ${key}`);
        return key;
      }
      translation = translation[k];
    }

    return translation;
  }, [language]);

  return {
    language,
    setLanguage,
    t,
    isRTL,
  };
}; 