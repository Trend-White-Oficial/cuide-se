import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthScreen } from '../AuthScreen';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('AuthScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    replace: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      clearError: jest.fn()
    });
  });

  it('renderiza corretamente a tela de login', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    expect(getByText('Entrar')).toBeTruthy();
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Criar conta')).toBeTruthy();
  });

  it('alterna entre os formulários de login e registro', () => {
    const { getByText, queryByPlaceholderText } = render(<AuthScreen />);

    expect(queryByPlaceholderText('Nome')).toBeNull();
    expect(queryByPlaceholderText('Confirmar senha')).toBeNull();

    fireEvent.press(getByText('Criar conta'));

    expect(getByText('Cadastrar')).toBeTruthy();
    expect(queryByPlaceholderText('Nome')).toBeTruthy();
    expect(queryByPlaceholderText('Confirmar senha')).toBeTruthy();

    fireEvent.press(getByText('Já tem uma conta? Entre'));

    expect(getByText('Entrar')).toBeTruthy();
    expect(queryByPlaceholderText('Nome')).toBeNull();
    expect(queryByPlaceholderText('Confirmar senha')).toBeNull();
  });

  it('realiza login com sucesso', async () => {
    const login = jest.fn().mockResolvedValue({ success: true });
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login,
      register: jest.fn(),
      clearError: jest.fn()
    });

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText('E-mail'), 'joao@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'joao@example.com',
        password: 'senha123'
      });
      expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
    });
  });

  it('realiza registro com sucesso', async () => {
    const register = jest.fn().mockResolvedValue({ success: true });
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register,
      clearError: jest.fn()
    });

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.press(getByText('Criar conta'));
    fireEvent.changeText(getByPlaceholderText('Nome'), 'João Silva');
    fireEvent.changeText(getByPlaceholderText('E-mail'), 'joao@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Confirmar senha'), 'senha123');
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123'
      });
      expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
    });
  });

  it('exibe indicador de carregamento durante autenticação', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      clearError: jest.fn()
    });

    const { getByTestId } = render(<AuthScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro na autenticação', () => {
    const errorMessage = 'Credenciais inválidas';
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: errorMessage,
      login: jest.fn(),
      register: jest.fn(),
      clearError: jest.fn()
    });

    const { getByText } = render(<AuthScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('valida campos obrigatórios no login', async () => {
    const login = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login,
      register: jest.fn(),
      clearError: jest.fn()
    });

    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText('Entrar'));

    expect(getByText('E-mail é obrigatório')).toBeTruthy();
    expect(getByText('Senha é obrigatória')).toBeTruthy();
    expect(login).not.toHaveBeenCalled();
  });

  it('valida campos obrigatórios no registro', async () => {
    const register = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register,
      clearError: jest.fn()
    });

    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText('Criar conta'));
    fireEvent.press(getByText('Cadastrar'));

    expect(getByText('Nome é obrigatório')).toBeTruthy();
    expect(getByText('E-mail é obrigatório')).toBeTruthy();
    expect(getByText('Senha é obrigatória')).toBeTruthy();
    expect(getByText('Confirmação de senha é obrigatória')).toBeTruthy();
    expect(register).not.toHaveBeenCalled();
  });

  it('valida confirmação de senha no registro', async () => {
    const register = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register,
      clearError: jest.fn()
    });

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.press(getByText('Criar conta'));
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Confirmar senha'), 'senha456');
    fireEvent.press(getByText('Cadastrar'));

    expect(getByText('As senhas não conferem')).toBeTruthy();
    expect(register).not.toHaveBeenCalled();
  });

  it('limpa erros ao alternar entre formulários', () => {
    const clearError = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: 'Erro anterior',
      login: jest.fn(),
      register: jest.fn(),
      clearError
    });

    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText('Criar conta'));
    expect(clearError).toHaveBeenCalled();

    clearError.mockClear();
    fireEvent.press(getByText('Já tem uma conta? Entre'));
    expect(clearError).toHaveBeenCalled();
  });
}); 