import { useState, useEffect, useCallback } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';
import { useDevice } from './useDevice';
import { useStorage } from './useStorage';
import { useToast } from './useToast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

interface Translation {
  [key: string]: string | Translation;
}

interface LanguageState {
  currentLanguage: Language;
  availableLanguages: Language[];
  translations: Translation;
  isRTL: boolean;
}

const DEFAULT_LANGUAGE: Language = {
  code: 'pt-BR',
  name: 'Portuguese',
  nativeName: 'Português',
  direction: 'ltr',
};

const AVAILABLE_LANGUAGES: Language[] = [
  DEFAULT_LANGUAGE,
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
  },
];

export const useLanguage = () => {
  const [state, setState] = useState<LanguageState>({
    currentLanguage: DEFAULT_LANGUAGE,
    availableLanguages: AVAILABLE_LANGUAGES,
    translations: {},
    isRTL: false,
  });

  const { deviceState } = useDevice();
  const { getItem, setItem } = useStorage();
  const { showToast } = useToast();

  // Carrega as traduções
  const loadTranslations = useCallback(async (languageCode: string): Promise<void> => {
    try {
      // Carrega as traduções do arquivo
      const translations = await import(`../translations/${languageCode}.json`);
      setState(prev => ({ ...prev, translations }));
    } catch (error) {
      console.error('Erro ao carregar traduções:', error);
      showToast({
        type: 'error',
        message: 'Erro ao carregar idioma',
        description: 'Usando idioma padrão',
      });
    }
  }, [showToast]);

  // Carrega o idioma salvo
  const loadSavedLanguage = useCallback(async (): Promise<void> => {
    try {
      const savedLanguage = await getItem<Language>('@CuideSe:language');
      if (savedLanguage) {
        await changeLanguage(savedLanguage.code);
      } else {
        // Usa o idioma do dispositivo
        const deviceLanguage = deviceState.systemName === 'iOS'
          ? NativeModules.LanguageManager.language
          : NativeModules.I18nManager.localeIdentifier;

        const matchedLanguage = AVAILABLE_LANGUAGES.find(
          lang => lang.code.startsWith(deviceLanguage.split('_')[0])
        );

        if (matchedLanguage) {
          await changeLanguage(matchedLanguage.code);
        } else {
          await changeLanguage(DEFAULT_LANGUAGE.code);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar idioma salvo:', error);
      await changeLanguage(DEFAULT_LANGUAGE.code);
    }
  }, [deviceState, getItem]);

  // Muda o idioma
  const changeLanguage = useCallback(async (languageCode: string): Promise<void> => {
    try {
      const language = AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
      if (!language) {
        throw new Error('Idioma não suportado');
      }

      // Atualiza o estado
      setState(prev => ({
        ...prev,
        currentLanguage: language,
        isRTL: language.direction === 'rtl',
      }));

      // Salva a preferência
      await setItem('@CuideSe:language', language);

      // Carrega as traduções
      await loadTranslations(languageCode);

      // Atualiza a direção do texto
      if (Platform.OS === 'android') {
        I18nManager.forceRTL(language.direction === 'rtl');
      }

      showToast({
        type: 'success',
        message: 'Idioma alterado',
        description: `Agora o app está em ${language.nativeName}`,
      });
    } catch (error) {
      console.error('Erro ao mudar idioma:', error);
      showToast({
        type: 'error',
        message: 'Erro ao mudar idioma',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [loadTranslations, setItem, showToast]);

  // Traduz uma chave
  const t = useCallback(
    (key: string, params?: { [key: string]: string }): string => {
      try {
        const keys = key.split('.');
        let value: any = state.translations;

        for (const k of keys) {
          value = value[k];
          if (!value) {
            return key;
          }
        }

        if (typeof value !== 'string') {
          return key;
        }

        if (params) {
          return Object.entries(params).reduce(
            (str, [param, val]) => str.replace(`{${param}}`, val),
            value
          );
        }

        return value;
      } catch (error) {
        console.error('Erro ao traduzir:', error);
        return key;
      }
    },
    [state.translations]
  );

  // Verifica se uma chave existe
  const hasTranslation = useCallback(
    (key: string): boolean => {
      try {
        const keys = key.split('.');
        let value: any = state.translations;

        for (const k of keys) {
          value = value[k];
          if (!value) {
            return false;
          }
        }

        return typeof value === 'string';
      } catch (error) {
        console.error('Erro ao verificar tradução:', error);
        return false;
      }
    },
    [state.translations]
  );

  // Carrega o idioma inicial
  useEffect(() => {
    loadSavedLanguage();
  }, [loadSavedLanguage]);

  return {
    ...state,
    changeLanguage,
    t,
    hasTranslation,
  };
}; 