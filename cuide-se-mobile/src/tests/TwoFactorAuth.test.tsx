import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TwoFactorAuth } from '../components/TwoFactorAuth';
import { securityService } from '../services/security';

// Mock do serviço de segurança
jest.mock('../services/security', () => ({
  securityService: {
    setup2FA: jest.fn(),
    verify2FA: jest.fn(),
  },
}));

describe('TwoFactorAuth', () => {
  const mockUserId = 'user123';
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente', () => {
    const { getByText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(getByText('Configurar Autenticação em Duas Etapas')).toBeTruthy();
  });

  it('deve configurar 2FA ao montar o componente', async () => {
    const mockSecret = 'TEST123';
    (securityService.setup2FA as jest.Mock).mockResolvedValue(mockSecret);

    const { getByText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(securityService.setup2FA).toHaveBeenCalledWith(mockUserId);
      expect(getByText(`Chave secreta: ${mockSecret}`)).toBeTruthy();
    });
  });

  it('deve mostrar erro ao falhar na configuração', async () => {
    (securityService.setup2FA as jest.Mock).mockRejectedValue(new Error('Erro de configuração'));

    render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  it('deve mudar para a etapa de verificação ao clicar no botão', async () => {
    const mockSecret = 'TEST123';
    (securityService.setup2FA as jest.Mock).mockResolvedValue(mockSecret);

    const { getByText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(getByText('Já escaneei o QR Code')).toBeTruthy();
    });

    fireEvent.press(getByText('Já escaneei o QR Code'));

    expect(getByText('Verificar Código')).toBeTruthy();
  });

  it('deve verificar o token corretamente', async () => {
    const mockSecret = 'TEST123';
    (securityService.setup2FA as jest.Mock).mockResolvedValue(mockSecret);
    (securityService.verify2FA as jest.Mock).mockResolvedValue(true);

    const { getByText, getByLabelText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Avançar para etapa de verificação
    await waitFor(() => {
      fireEvent.press(getByText('Já escaneei o QR Code'));
    });

    // Inserir token
    const tokenInput = getByLabelText('Código de Verificação');
    fireEvent.changeText(tokenInput, '123456');

    // Verificar token
    fireEvent.press(getByText('Verificar'));

    await waitFor(() => {
      expect(securityService.verify2FA).toHaveBeenCalledWith(mockUserId, '123456');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('deve mostrar erro ao falhar na verificação', async () => {
    const mockSecret = 'TEST123';
    (securityService.setup2FA as jest.Mock).mockResolvedValue(mockSecret);
    (securityService.verify2FA as jest.Mock).mockResolvedValue(false);

    const { getByText, getByLabelText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Avançar para etapa de verificação
    await waitFor(() => {
      fireEvent.press(getByText('Já escaneei o QR Code'));
    });

    // Inserir token
    const tokenInput = getByLabelText('Código de Verificação');
    fireEvent.changeText(tokenInput, '000000');

    // Verificar token
    fireEvent.press(getByText('Verificar'));

    await waitFor(() => {
      expect(securityService.verify2FA).toHaveBeenCalledWith(mockUserId, '000000');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('deve chamar onCancel ao clicar no botão de cancelar', async () => {
    const mockSecret = 'TEST123';
    (securityService.setup2FA as jest.Mock).mockResolvedValue(mockSecret);

    const { getByText } = render(
      <TwoFactorAuth
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Avançar para etapa de verificação
    await waitFor(() => {
      fireEvent.press(getByText('Já escaneei o QR Code'));
    });

    // Clicar em cancelar
    fireEvent.press(getByText('Cancelar'));

    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 