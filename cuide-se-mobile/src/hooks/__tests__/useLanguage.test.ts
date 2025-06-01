import { renderHook, act } from '@testing-library/react-hooks';
import { useLanguage } from '../useLanguage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('i18next', () => ({
  t: jest.fn(),
  language: 'pt-BR',
  changeLanguage: jest.fn(),
}));

describe('useLanguage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return current language and available languages', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.currentLanguage).toBe('pt-BR');
    expect(result.current.availableLanguages).toEqual([
      { code: 'pt-BR', name: 'Português' },
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Español' },
    ]);
  });

  it('should change language successfully', async () => {
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.changeLanguage('en-US');
    });

    expect(i18next.changeLanguage).toHaveBeenCalledWith('en-US');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'en-US');
  });

  it('should handle error when changing language', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('Failed to change language');
    
    (i18next.changeLanguage as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.changeLanguage('en-US');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error changing language:', mockError);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should get current language', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.getCurrentLanguage()).toBe('pt-BR');
  });

  it('should get available languages', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.getAvailableLanguages()).toEqual([
      { code: 'pt-BR', name: 'Português' },
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Español' },
    ]);
  });
}); 