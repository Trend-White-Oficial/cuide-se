import { securityService } from '../services/security';

describe('SecurityService', () => {
  describe('validateCard', () => {
    it('deve validar um cartão válido', () => {
      const result = securityService.validateCard(
        '4532015112830366',
        '12/25',
        '123'
      );
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar um cartão inválido', () => {
      const result = securityService.validateCard(
        '4532015112830367',
        '12/25',
        '123'
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Número do cartão inválido');
    });

    it('deve rejeitar uma data de expiração inválida', () => {
      const result = securityService.validateCard(
        '4532015112830366',
        '12/20',
        '123'
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data de expiração inválida');
    });

    it('deve rejeitar um CVV inválido', () => {
      const result = securityService.validateCard(
        '4532015112830366',
        '12/25',
        '12'
      );
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CVV inválido');
    });
  });

  describe('validatePasswordStrength', () => {
    it('deve aceitar uma senha forte', () => {
      const result = securityService.validatePasswordStrength('Abc123!@#');
      expect(result).toBe(true);
    });

    it('deve rejeitar uma senha fraca', () => {
      const result = securityService.validatePasswordStrength('abc123');
      expect(result).toBe(false);
    });

    it('deve rejeitar uma senha sem caracteres especiais', () => {
      const result = securityService.validatePasswordStrength('Abc12345');
      expect(result).toBe(false);
    });

    it('deve rejeitar uma senha sem números', () => {
      const result = securityService.validatePasswordStrength('Abcdef!@#');
      expect(result).toBe(false);
    });
  });

  describe('encryptData', () => {
    it('deve criptografar dados corretamente', async () => {
      const data = 'dados sensíveis';
      const encrypted = await securityService.encryptData(data);
      expect(encrypted).toContain(':');
      expect(encrypted.split(':')).toHaveLength(2);
    });

    it('deve gerar resultados diferentes para a mesma entrada', async () => {
      const data = 'dados sensíveis';
      const encrypted1 = await securityService.encryptData(data);
      const encrypted2 = await securityService.encryptData(data);
      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('tokenizeData', () => {
    it('deve gerar um token único', async () => {
      const data = 'dados sensíveis';
      const token = await securityService.tokenizeData(data);
      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
    });

    it('deve gerar tokens diferentes para a mesma entrada', async () => {
      const data = 'dados sensíveis';
      const token1 = await securityService.tokenizeData(data);
      const token2 = await securityService.tokenizeData(data);
      expect(token1).not.toBe(token2);
    });
  });

  describe('logSecurityEvent', () => {
    it('deve registrar um evento de segurança', async () => {
      const action = 'login';
      const details = { ip: '127.0.0.1' };
      
      await expect(
        securityService.logSecurityEvent(action, details)
      ).resolves.not.toThrow();
    });

    it('deve lançar erro quando não há sessão', async () => {
      const action = 'login';
      const details = { ip: '127.0.0.1' };
      
      // Mock da sessão vazia
      jest.spyOn(require('../services/supabase'), 'supabase')
        .mockReturnValue({
          auth: {
            getSession: () => ({ data: { session: null } })
          }
        });

      await expect(
        securityService.logSecurityEvent(action, details)
      ).rejects.toThrow('Usuário não autenticado');
    });
  });

  describe('setup2FA', () => {
    it('deve configurar 2FA corretamente', async () => {
      const userId = 'user123';
      const secret = await securityService.setup2FA(userId);
      
      expect(secret).toBeDefined();
      expect(secret.length).toBeGreaterThan(0);
      expect(/^[A-Z2-7]+$/.test(secret)).toBe(true); // Base32
    });

    it('deve gerar chaves diferentes para o mesmo usuário', async () => {
      const userId = 'user123';
      const secret1 = await securityService.setup2FA(userId);
      const secret2 = await securityService.setup2FA(userId);
      
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('verify2FA', () => {
    it('deve verificar um token válido', async () => {
      const userId = 'user123';
      const token = '123456';
      
      // Mock da verificação
      jest.spyOn(require('../services/supabase'), 'supabase')
        .mockReturnValue({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => ({
                  data: { secret: 'TEST123' }
                })
              })
            })
          })
        });

      const result = await securityService.verify2FA(userId, token);
      expect(result).toBe(true);
    });

    it('deve rejeitar um token inválido', async () => {
      const userId = 'user123';
      const token = '000000';
      
      // Mock da verificação
      jest.spyOn(require('../services/supabase'), 'supabase')
        .mockReturnValue({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => ({
                  data: { secret: 'TEST123' }
                })
              })
            })
          })
        });

      const result = await securityService.verify2FA(userId, token);
      expect(result).toBe(false);
    });
  });
}); 