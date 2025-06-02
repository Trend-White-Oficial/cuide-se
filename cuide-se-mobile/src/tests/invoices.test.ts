import { InvoiceService } from '../services/invoices';
import { supabase } from '../lib/supabase';

// Mock do Supabase
jest.mock('../lib/supabase', () => ({
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

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  const mockUserId = 'user123';
  const mockPaymentId = 'payment123';

  beforeEach(() => {
    jest.clearAllMocks();
    invoiceService = new InvoiceService();
  });

  describe('generateInvoice', () => {
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

    it('deve gerar uma fatura com sucesso', async () => {
      // Mock das chamadas do Supabase
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

      const result = await invoiceService.generateInvoice(mockPaymentId);

      expect(result).toEqual(mockInvoice);
      expect(supabase.from).toHaveBeenCalledWith('payments');
      expect(supabase.from).toHaveBeenCalledWith('invoices');
      expect(supabase.storage.from).toHaveBeenCalledWith('invoices');
    });

    it('deve lançar erro quando o pagamento não for encontrado', async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'payments') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {};
      });

      await expect(invoiceService.generateInvoice(mockPaymentId)).rejects.toThrow('Pagamento não encontrado');
    });

    it('deve lançar erro quando o pagamento não estiver concluído', async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'payments') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({
              data: [{ ...mockPayment, status: 'pending' }],
              error: null,
            }),
          };
        }
        return {};
      });

      await expect(invoiceService.generateInvoice(mockPaymentId)).rejects.toThrow('Pagamento não está concluído');
    });
  });

  describe('getInvoiceById', () => {
    const mockInvoice = {
      id: 'invoice123',
      number: 'INV-001',
      payment_id: mockPaymentId,
      user_id: mockUserId,
      amount: 100,
      status: 'generated',
    };

    it('deve retornar uma fatura pelo ID', async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [mockInvoice], error: null }),
          };
        }
        return {};
      });

      const result = await invoiceService.getInvoiceById('invoice123');

      expect(result).toEqual(mockInvoice);
      expect(supabase.from).toHaveBeenCalledWith('invoices');
    });

    it('deve lançar erro quando a fatura não for encontrada', async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {};
      });

      await expect(invoiceService.getInvoiceById('invoice123')).rejects.toThrow('Fatura não encontrada');
    });
  });

  describe('getUserInvoices', () => {
    const mockInvoices = [
      {
        id: 'invoice123',
        number: 'INV-001',
        payment_id: mockPaymentId,
        user_id: mockUserId,
        amount: 100,
        status: 'generated',
      },
      {
        id: 'invoice124',
        number: 'INV-002',
        payment_id: 'payment124',
        user_id: mockUserId,
        amount: 200,
        status: 'generated',
      },
    ];

    it('deve retornar todas as faturas do usuário', async () => {
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

      expect(result).toEqual(mockInvoices);
      expect(supabase.from).toHaveBeenCalledWith('invoices');
    });

    it('deve retornar array vazio quando não houver faturas', async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'invoices') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {};
      });

      const result = await invoiceService.getUserInvoices(mockUserId);

      expect(result).toEqual([]);
    });
  });
}); 