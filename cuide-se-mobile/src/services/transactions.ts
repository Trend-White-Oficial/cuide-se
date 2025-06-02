import { supabase } from './supabase';

export interface Transaction {
  id: string;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
}

class TransactionService {
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.paymentMethod) {
        query = query.eq('payment_method', filters.paymentMethod);
      }
      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount);
      }
      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      throw error;
    }
  }

  async exportTransactions(format: 'pdf' | 'csv' | 'excel', filters: TransactionFilters = {}): Promise<string> {
    try {
      const transactions = await this.getTransactions(filters);
      
      switch (format) {
        case 'pdf':
          return this.generatePDF(transactions);
        case 'csv':
          return this.generateCSV(transactions);
        case 'excel':
          return this.generateExcel(transactions);
        default:
          throw new Error('Formato de exportação não suportado');
      }
    } catch (error) {
      console.error('Erro ao exportar transações:', error);
      throw error;
    }
  }

  private generatePDF(transactions: Transaction[]): string {
    // Implementar geração de PDF
    // Retornar URL do arquivo gerado
    return 'url_do_pdf';
  }

  private generateCSV(transactions: Transaction[]): string {
    // Implementar geração de CSV
    // Retornar URL do arquivo gerado
    return 'url_do_csv';
  }

  private generateExcel(transactions: Transaction[]): string {
    // Implementar geração de Excel
    // Retornar URL do arquivo gerado
    return 'url_do_excel';
  }
}

export const transactionService = new TransactionService(); 