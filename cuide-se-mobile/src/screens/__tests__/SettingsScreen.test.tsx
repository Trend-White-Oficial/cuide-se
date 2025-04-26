import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

jest.mock('@/hooks/useSettings', () => ({
  useSettings: jest.fn()
}));

describe('SettingsScreen', () => {
  const mockSettings = {
    notifications: true,
    darkMode: false,
    language: 'pt-BR',
    emailNotifications: true,
    pushNotifications: true
  };

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'João Silva' },
      isLoading: false,
      error: null
    });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings: jest.fn()
    });
  });

  it('renderiza corretamente a tela de configurações', () => {
    const { getByText, getByTestId } = render(<SettingsScreen />);

    expect(getByText('Configurações')).toBeTruthy();
    expect(getByText('Notificações')).toBeTruthy();
    expect(getByText('Tema Escuro')).toBeTruthy();
    expect(getByText('Idioma')).toBeTruthy();
    expect(getByTestId('notifications-switch')).toBeTruthy();
    expect(getByTestId('dark-mode-switch')).toBeTruthy();
  });

  it('permite alternar notificações', async () => {
    const updateSettings = jest.fn().mockResolvedValue({ success: true });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('notifications-switch'));

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        notifications: false
      });
    });
  });

  it('permite alternar tema escuro', async () => {
    const updateSettings = jest.fn().mockResolvedValue({ success: true });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('dark-mode-switch'));

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        darkMode: true
      });
    });
  });

  it('permite alterar o idioma', async () => {
    const updateSettings = jest.fn().mockResolvedValue({ success: true });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId, getByText } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('language-selector'));
    fireEvent.press(getByText('English'));

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        language: 'en'
      });
    });
  });

  it('permite configurar notificações por email', async () => {
    const updateSettings = jest.fn().mockResolvedValue({ success: true });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('email-notifications-switch'));

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        emailNotifications: false
      });
    });
  });

  it('permite configurar notificações push', async () => {
    const updateSettings = jest.fn().mockResolvedValue({ success: true });
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('push-notifications-switch'));

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith({
        ...mockSettings,
        pushNotifications: false
      });
    });
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useSettings as jest.Mock).mockReturnValue({
      settings: null,
      isLoading: true,
      error: null,
      updateSettings: jest.fn()
    });

    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar configurações';
    (useSettings as jest.Mock).mockReturnValue({
      settings: null,
      isLoading: false,
      error: errorMessage,
      updateSettings: jest.fn()
    });

    const { getByText } = render(<SettingsScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('carrega as configurações ao montar o componente', async () => {
    const getSettings = jest.fn();
    (useSettings as jest.Mock).mockReturnValue({
      settings: null,
      isLoading: false,
      error: null,
      getSettings,
      updateSettings: jest.fn()
    });

    render(<SettingsScreen />);

    await waitFor(() => {
      expect(getSettings).toHaveBeenCalled();
    });
  });

  it('exibe confirmação antes de desativar notificações', () => {
    const updateSettings = jest.fn();
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { getByTestId, getByText, queryByText } = render(<SettingsScreen />);

    fireEvent.press(getByTestId('notifications-switch'));

    expect(getByText('Deseja desativar as notificações?')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Confirmar')).toBeTruthy();

    fireEvent.press(getByText('Cancelar'));
    expect(queryByText('Deseja desativar as notificações?')).toBeNull();
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it('salva todas as configurações ao sair da tela', () => {
    const updateSettings = jest.fn();
    (useSettings as jest.Mock).mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      error: null,
      updateSettings
    });

    const { unmount } = render(<SettingsScreen />);

    unmount();

    expect(updateSettings).toHaveBeenCalledWith(mockSettings);
  });
}); 