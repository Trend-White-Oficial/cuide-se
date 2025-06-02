import { supabase } from '../../lib/supabase';
import { securityService } from '../../services/security';

// Mock do Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(),
      select: jest.fn(),
      eq: jest.fn(),
      order: jest.fn(),
    })),
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      session: jest.fn(),
    },
  },
}));

describe('Testes de Autenticação', () => {
  const mockUserId = 'user123';
  const mockEmail = 'usuario@teste.com';
  const mockPassword = 'Senha@123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('deve autenticar usuário com credenciais válidas', async () => {
      // Configurar mock
      (supabase.auth.signIn as jest.Mock).mockResolvedValue({
        data: {
          user: { id: mockUserId, email: mockEmail },
          session: { access_token: 'valid-token' },
        },
        error: null,
      });

      const result = await securityService.login(mockEmail, mockPassword);
      expect(result.user.id).toBe(mockUserId);
      expect(result.session.access_token).toBe('valid-token');
    });

    it('deve rejeitar login com credenciais inválidas', async () => {
      // Configurar mock
      (supabase.auth.signIn as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Credenciais inválidas' },
      });

      await expect(securityService.login(mockEmail, 'senha-errada')).rejects.toThrow('Credenciais inválidas');
    });

    it('deve validar formato do email', async () => {
      const invalidEmails = [
        'usuario',
        'usuario@',
        '@teste.com',
        'usuario@teste',
        'usuario.teste.com',
      ];

      for (const email of invalidEmails) {
        await expect(securityService.login(email, mockPassword)).rejects.toThrow('Email inválido');
      }
    });

    it('deve validar força da senha', async () => {
      const weakPasswords = [
        '123456',
        'password',
        'qwerty',
        'abc123',
        '111111',
      ];

      for (const password of weakPasswords) {
        await expect(securityService.login(mockEmail, password)).rejects.toThrow('Senha muito fraca');
      }
    });
  });

  describe('Logout', () => {
    it('deve fazer logout com sucesso', async () => {
      // Configurar mock
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await expect(securityService.logout()).resolves.not.toThrow();
    });

    it('deve limpar dados da sessão ao fazer logout', async () => {
      // Configurar mock
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await securityService.logout();
      expect(securityService.getCurrentUser()).toBeNull();
      expect(securityService.getSession()).toBeNull();
    });
  });

  describe('Autenticação em Duas Etapas', () => {
    it('deve configurar 2FA com sucesso', async () => {
      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'users') {
          return {
            update: jest.fn().mockResolvedValue({
              data: { two_factor_enabled: true },
              error: null,
            }),
          };
        }
        return {};
      });

      const result = await securityService.setup2FA(mockUserId);
      expect(result.secret).toMatch(/^[A-Z2-7]{32}$/); // Base32
      expect(result.qrCode).toBeDefined();
    });

    it('deve verificar token 2FA corretamente', async () => {
      const validToken = '123456';
      const invalidToken = '000000';

      // Configurar mock
      (securityService.verify2FA as jest.Mock).mockImplementation((userId, token) => {
        return Promise.resolve(token === validToken);
      });

      const validResult = await securityService.verify2FA(mockUserId, validToken);
      expect(validResult).toBe(true);

      const invalidResult = await securityService.verify2FA(mockUserId, invalidToken);
      expect(invalidResult).toBe(false);
    });

    it('deve limitar tentativas de 2FA', async () => {
      const maxAttempts = 5;
      let attempts = 0;

      // Configurar mock
      (securityService.verify2FA as jest.Mock).mockImplementation(() => {
        attempts++;
        if (attempts > maxAttempts) {
          throw new Error('Muitas tentativas. Tente novamente mais tarde.');
        }
        return Promise.resolve(false);
      });

      // Tentar autenticar múltiplas vezes
      for (let i = 0; i < maxAttempts + 1; i++) {
        try {
          await securityService.verify2FA(mockUserId, '000000');
        } catch (error) {
          if (i === maxAttempts) {
            expect(error.message).toBe('Muitas tentativas. Tente novamente mais tarde.');
          }
        }
      }

      expect(attempts).toBe(maxAttempts + 1);
    });
  });

  describe('Gerenciamento de Sessão', () => {
    it('deve validar token de sessão', async () => {
      const validToken = 'valid-token';
      const invalidToken = 'invalid-token';

      // Configurar mock
      (supabase.auth.session as jest.Mock).mockImplementation((token) => {
        return Promise.resolve({
          data: token === validToken ? { user: { id: mockUserId } } : null,
          error: token === invalidToken ? { message: 'Token inválido' } : null,
        });
      });

      const validResult = await securityService.validateSession(validToken);
      expect(validResult).toBe(true);

      const invalidResult = await securityService.validateSession(invalidToken);
      expect(invalidResult).toBe(false);
    });

    it('deve renovar token de sessão', async () => {
      const oldToken = 'old-token';
      const newToken = 'new-token';

      // Configurar mock
      (supabase.auth.session as jest.Mock).mockResolvedValue({
        data: {
          user: { id: mockUserId },
          access_token: newToken,
        },
        error: null,
      });

      const result = await securityService.refreshSession(oldToken);
      expect(result.access_token).toBe(newToken);
    });

    it('deve expirar sessão após timeout', async () => {
      // Configurar mock
      (supabase.auth.session as jest.Mock).mockResolvedValue({
        data: {
          user: { id: mockUserId },
          expires_at: Date.now() - 1000, // Token expirado
        },
        error: null,
      });

      await expect(securityService.validateSession('expired-token')).rejects.toThrow('Sessão expirada');
    });
  });
}); 