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

describe('Testes de Memória', () => {
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

    it('não deve vazar memória ao gerar múltiplas faturas', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 1000;
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

      // Gerar faturas
      for (let i = 0; i < iterations; i++) {
        promises.push(invoiceService.generateInvoice(mockPaymentId));
      }

      await Promise.all(promises);

      // Forçar coleta de lixo
      global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;
      const memoryPerOperation = memoryUsed / iterations;

      // Verificar se o uso de memória por operação está dentro de limites aceitáveis
      expect(memoryPerOperation).toBeLessThan(1024 * 1024); // Menos de 1MB por operação
    });
  });

  describe('Autenticação em Duas Etapas', () => {
    it('não deve vazar memória ao processar múltiplas verificações', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 1000;
      const promises = [];

      // Mock da verificação 2FA
      (securityService.verify2FA as jest.Mock).mockResolvedValue(true);

      // Processar verificações
      for (let i = 0; i < iterations; i++) {
        promises.push(securityService.verify2FA(mockUserId, '123456'));
      }

      await Promise.all(promises);

      // Forçar coleta de lixo
      global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;
      const memoryPerOperation = memoryUsed / iterations;

      // Verificar se o uso de memória por operação está dentro de limites aceitáveis
      expect(memoryPerOperation).toBeLessThan(1024 * 100); // Menos de 100KB por operação
    });
  });

  describe('Criptografia de Dados', () => {
    it('não deve vazar memória ao criptografar grandes volumes de dados', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 1000;
      const dataSize = 1024 * 1024; // 1MB de dados
      const promises = [];

      // Gerar dados grandes
      const largeData = 'x'.repeat(dataSize);

      // Criptografar dados
      for (let i = 0; i < iterations; i++) {
        promises.push(securityService.encryptData(largeData));
      }

      await Promise.all(promises);

      // Forçar coleta de lixo
      global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;
      const memoryPerOperation = memoryUsed / iterations;

      // Verificar se o uso de memória por operação está dentro de limites aceitáveis
      expect(memoryPerOperation).toBeLessThan(dataSize * 2); // Menos que o dobro do tamanho dos dados
    });
  });

  describe('Busca de Faturas', () => {
    it('não deve vazar memória ao buscar grandes conjuntos de dados', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 100;
      const promises = [];

      const largeDataset = Array(1000).fill(null).map((_, index) => ({
        id: `invoice${index}`,
        number: `INV-${String(index).padStart(5, '0')}`,
        payment_id: `payment${index}`,
        user_id: mockUserId,
        amount: 100,
        status: 'generated',
      }));

      // Configurar mock
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: largeDataset, error: null }),
          };
        }
        return {};
      });

      // Buscar faturas
      for (let i = 0; i < iterations; i++) {
        promises.push(invoiceService.getUserInvoices(mockUserId));
      }

      await Promise.all(promises);

      // Forçar coleta de lixo
      global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryUsed = finalMemory - initialMemory;
      const memoryPerOperation = memoryUsed / iterations;

      // Verificar se o uso de memória por operação está dentro de limites aceitáveis
      expect(memoryPerOperation).toBeLessThan(1024 * 1024 * 2); // Menos de 2MB por operação
    });
  });
}); 