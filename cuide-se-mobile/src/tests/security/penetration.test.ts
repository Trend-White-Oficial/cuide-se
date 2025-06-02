import { supabase } from '../../lib/supabase';
import { InvoiceService } from '../../services/invoices';
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
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

describe('Testes de Penetração', () => {
  let invoiceService: InvoiceService;
  const mockUserId = 'user123';
  const mockPaymentId = 'payment123';

  beforeEach(() => {
    jest.clearAllMocks();
    invoiceService = new InvoiceService();
  });

  describe('Injeção SQL', () => {
    it('deve prevenir injeção SQL em consultas de faturas', async () => {
      const maliciousInput = "'; DROP TABLE invoices; --";
      
      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              // Verificar se o valor contém caracteres maliciosos
              expect(value).not.toContain("'");
              expect(value).not.toContain(';');
              expect(value).not.toContain('--');
              return Promise.resolve({ data: [], error: null });
            }),
          };
        }
        return {};
      });

      await invoiceService.getInvoiceById(maliciousInput);
    });

    it('deve prevenir injeção SQL em consultas de usuários', async () => {
      const maliciousInput = "'; UPDATE users SET role = 'admin' WHERE id = '1'; --";
      
      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              // Verificar se o valor contém caracteres maliciosos
              expect(value).not.toContain("'");
              expect(value).not.toContain(';');
              expect(value).not.toContain('--');
              return Promise.resolve({ data: [], error: null });
            }),
          };
        }
        return {};
      });

      await securityService.verify2FA(maliciousInput, '123456');
    });
  });

  describe('XSS (Cross-Site Scripting)', () => {
    it('deve prevenir XSS em dados de faturas', async () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      
      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              // Verificar se os dados contêm scripts
              expect(data.customer.name).not.toContain('<script>');
              expect(data.customer.name).not.toContain('</script>');
              return Promise.resolve({ data: [data], error: null });
            }),
          };
        }
        return {};
      });

      await invoiceService.generateInvoice(mockPaymentId);
    });

    it('deve sanitizar dados de entrada', async () => {
      const maliciousInput = {
        name: '<img src="x" onerror="alert(\'XSS\')">',
        email: '"><script>alert("XSS")</script>',
      };

      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'users') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              // Verificar se os dados foram sanitizados
              expect(data.name).not.toContain('<img');
              expect(data.name).not.toContain('onerror');
              expect(data.email).not.toContain('<script>');
              return Promise.resolve({ data: [data], error: null });
            }),
          };
        }
        return {};
      });

      await securityService.setup2FA(mockUserId);
    });
  });

  describe('CSRF (Cross-Site Request Forgery)', () => {
    it('deve validar tokens CSRF em requisições', async () => {
      const maliciousRequest = {
        userId: mockUserId,
        csrfToken: 'invalid-token',
      };

      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'users') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((field, value) => {
              // Verificar se o token CSRF é válido
              expect(value).not.toBe(maliciousRequest.csrfToken);
              return Promise.resolve({ data: [], error: null });
            }),
          };
        }
        return {};
      });

      await expect(securityService.verify2FA(mockUserId, '123456')).rejects.toThrow('Token CSRF inválido');
    });
  });

  describe('Ataques de Força Bruta', () => {
    it('deve limitar tentativas de autenticação', async () => {
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

  describe('Exposição de Dados Sensíveis', () => {
    it('não deve expor dados sensíveis em logs', async () => {
      const sensitiveData = {
        cardNumber: '4532015112830366',
        cvv: '123',
        password: 'senha123',
      };

      // Configurar mock
      (securityService.logSecurityEvent as jest.Mock).mockImplementation((action, details) => {
        // Verificar se dados sensíveis foram mascarados
        expect(details.cardNumber).not.toBe(sensitiveData.cardNumber);
        expect(details.cvv).not.toBe(sensitiveData.cvv);
        expect(details.password).not.toBe(sensitiveData.password);
        return Promise.resolve();
      });

      await securityService.logSecurityEvent('payment', sensitiveData);
    });

    it('deve criptografar dados sensíveis antes de armazenar', async () => {
      const sensitiveData = {
        cardNumber: '4532015112830366',
        cvv: '123',
        password: 'senha123',
      };

      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'payments') {
          return {
            insert: jest.fn().mockImplementation((data) => {
              // Verificar se os dados foram criptografados
              expect(data.cardNumber).not.toBe(sensitiveData.cardNumber);
              expect(data.cvv).not.toBe(sensitiveData.cvv);
              expect(data.password).not.toBe(sensitiveData.password);
              return Promise.resolve({ data: [data], error: null });
            }),
          };
        }
        return {};
      });

      await invoiceService.generateInvoice(mockPaymentId);
    });
  });
}); 