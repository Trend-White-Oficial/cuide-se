import { performance } from 'perf_hooks';
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

describe('Testes de Carga', () => {
  let invoiceService: InvoiceService;
  const mockUserId = 'user123';
  const mockPaymentId = 'payment123';

  beforeEach(() => {
    jest.clearAllMocks();
    invoiceService = new InvoiceService();
  });

  describe('Geração de Faturas', () => {
    const mockPayment = {
      id: mockPaymentId,
      amount: 100,
      user_id: mockUserId,
      status: 'completed',
    };

    const mockInvoice = {
      id: 'invoice123',
      number: 'INV-001',
      payment_id: mockPaymentId,
      user_id: mockUserId,
      amount: 100,
      status: 'generated',
      created_at: new Date().toISOString(),
      due_date: new Date().toISOString(),
      items: [
        {
          description: 'Serviço',
          quantity: 1,
          unit_price: 100,
          total: 100,
        },
      ],
      customer: {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
      },
      company: {
        name: 'Empresa Teste',
        document: '123456789',
      },
    };

    it('deve gerar 100 faturas em menos de 30 segundos', async () => {
      const startTime = performance.now();
      const promises = [];

      // Configurar mocks
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'payments') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [mockPayment], error: null }),
          };
        }
        if (table === 'invoices') {
          return {
            insert: jest.fn().mockResolvedValue({ data: [mockInvoice], error: null }),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [mockInvoice], error: null }),
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {};
      });

      (supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/invoice.pdf' } }),
      });

      // Gerar 100 faturas simultaneamente
      for (let i = 0; i < 100; i++) {
        promises.push(invoiceService.generateInvoice(mockPaymentId));
      }

      await Promise.all(promises);
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // Converter para segundos

      expect(duration).toBeLessThan(30);
    });
  });

  describe('Autenticação em Duas Etapas', () => {
    it('deve processar 1000 verificações 2FA em menos de 10 segundos', async () => {
      const startTime = performance.now();
      const promises = [];

      // Mock da verificação 2FA
      (securityService.verify2FA as jest.Mock).mockResolvedValue(true);

      // Processar 1000 verificações simultaneamente
      for (let i = 0; i < 1000; i++) {
        promises.push(securityService.verify2FA(mockUserId, '123456'));
      }

      await Promise.all(promises);
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;

      expect(duration).toBeLessThan(10);
    });
  });

  describe('Busca de Faturas', () => {
    const mockInvoices = Array(1000).fill(null).map((_, index) => ({
      id: `invoice${index}`,
      number: `INV-${String(index).padStart(3, '0')}`,
      payment_id: `payment${index}`,
      user_id: mockUserId,
      amount: 100,
      status: 'generated',
    }));

    it('deve buscar 1000 faturas em menos de 5 segundos', async () => {
      const startTime = performance.now();

      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: mockInvoices, error: null }),
          };
        }
        return {};
      });

      const result = await invoiceService.getUserInvoices(mockUserId);
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;

      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(5);
    });
  });

  describe('Criptografia de Dados', () => {
    it('deve criptografar 1000 registros em menos de 5 segundos', async () => {
      const startTime = performance.now();
      const promises = [];

      // Criptografar 1000 registros simultaneamente
      for (let i = 0; i < 1000; i++) {
        promises.push(securityService.encryptData(`dados sensíveis ${i}`));
      }

      await Promise.all(promises);
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;

      expect(duration).toBeLessThan(5);
    });
  });
}); 