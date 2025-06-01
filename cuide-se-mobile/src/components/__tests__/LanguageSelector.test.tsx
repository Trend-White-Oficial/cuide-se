import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslation } from 'react-i18next';

// Mock do hook useLanguage
jest.mock('../../hooks/useLanguage');

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('LanguageSelector', () => {
  const mockChangeLanguage = jest.fn();
  const mockUseLanguage = {
    currentLanguage: 'pt-BR',
    availableLanguages: [
      { code: 'pt-BR', name: 'Português' },
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Español' },
    ],
    changeLanguage: mockChangeLanguage,
  };

  const mockUseTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'profile.language': 'Idioma',
      };
      return translations[key] || key;
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLanguage as jest.Mock).mockReturnValue(mockUseLanguage);
    (useTranslation as jest.Mock).mockReturnValue(mockUseTranslation);
  });

  it('should render correctly with all language options', () => {
    const { getByText } = render(<LanguageSelector />);
    
    expect(getByText('Idioma')).toBeTruthy();
    expect(getByText('Português')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('Español')).toBeTruthy();
  });

  it('should call changeLanguage when a language is selected', () => {
    const { getByText } = render(<LanguageSelector />);
    
    fireEvent.press(getByText('English'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en-US');
  });

  it('should highlight the current language', () => {
    const { getByText } = render(<LanguageSelector />);
    
    const portugueseButton = getByText('Português').parent;
    expect(portugueseButton.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#2196f3' })
    );
  });

  it('should apply correct styles to language buttons', () => {
    const { getByText } = render(<LanguageSelector />);
    
    const languageButtons = [
      getByText('Português').parent,
      getByText('English').parent,
      getByText('Español').parent,
    ];

    languageButtons.forEach(button => {
      expect(button.props.style).toContainEqual(
        expect.objectContaining({
          padding: 12,
          borderRadius: 8,
          backgroundColor: expect.any(String),
        })
      );
    });
  });

  it('should apply correct text styles', () => {
    const { getByText } = render(<LanguageSelector />);
    
    const languageTexts = [
      getByText('Português'),
      getByText('English'),
      getByText('Español'),
    ];

    languageTexts.forEach(text => {
      expect(text.props.style).toContainEqual(
        expect.objectContaining({
          fontSize: 16,
          color: expect.any(String),
        })
      );
    });
  });

  it('should handle language change with error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockChangeLanguage.mockRejectedValueOnce(new Error('Failed to change language'));

    const { getByText } = render(<LanguageSelector />);
    
    await fireEvent.press(getByText('English'));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should maintain selected language state after error', async () => {
    mockChangeLanguage.mockRejectedValueOnce(new Error('Failed to change language'));

    const { getByText } = render(<LanguageSelector />);
    
    await fireEvent.press(getByText('English'));
    
    const portugueseButton = getByText('Português').parent;
    expect(portugueseButton.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#2196f3' })
    );
  });

  it('should update UI when language is changed successfully', async () => {
    const { getByText, rerender } = render(<LanguageSelector />);
    
    await fireEvent.press(getByText('English'));
    
    // Simula mudança de idioma bem-sucedida
    (useLanguage as jest.Mock).mockReturnValue({
      ...mockUseLanguage,
      currentLanguage: 'en-US',
    });
    
    rerender(<LanguageSelector />);
    
    const englishButton = getByText('English').parent;
    expect(englishButton.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#2196f3' })
    );
  });
}); 