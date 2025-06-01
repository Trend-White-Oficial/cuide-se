import i18n from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-localization', () => ({
  locale: 'pt-BR',
}));

describe('i18n Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct configuration', () => {
    expect(i18n.options.fallbackLng).toBe('pt-BR');
    expect(i18n.options.resources).toBeDefined();
    expect(i18n.options.compatibilityJSON).toBe('v3');
  });

  it('should have all required languages', () => {
    const resources = i18n.options.resources as Record<string, any>;
    
    expect(resources['pt-BR']).toBeDefined();
    expect(resources['en-US']).toBeDefined();
    expect(resources['es-ES']).toBeDefined();
  });

  it('should detect language from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('en-US');

    const languageDetector = i18n.services.languageDetector;
    const callback = jest.fn();

    await languageDetector.detect(callback);

    expect(callback).toHaveBeenCalledWith('en-US');
  });

  it('should fallback to device language when no saved language', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (Localization.locale as string) = 'pt-BR';

    const languageDetector = i18n.services.languageDetector;
    const callback = jest.fn();

    await languageDetector.detect(callback);

    expect(callback).toHaveBeenCalledWith('pt-BR');
  });

  it('should fallback to pt-BR when device language is not supported', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (Localization.locale as string) = 'fr-FR';

    const languageDetector = i18n.services.languageDetector;
    const callback = jest.fn();

    await languageDetector.detect(callback);

    expect(callback).toHaveBeenCalledWith('pt-BR');
  });

  it('should cache selected language', async () => {
    const languageDetector = i18n.services.languageDetector;
    
    await languageDetector.cacheUserLanguage('en-US');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'en-US');
  });

  it('should handle error when detecting language', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    const languageDetector = i18n.services.languageDetector;
    const callback = jest.fn();

    await languageDetector.detect(callback);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith('pt-BR');

    consoleErrorSpy.mockRestore();
  });

  it('should handle error when caching language', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    const languageDetector = i18n.services.languageDetector;
    
    await languageDetector.cacheUserLanguage('en-US');

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
}); 