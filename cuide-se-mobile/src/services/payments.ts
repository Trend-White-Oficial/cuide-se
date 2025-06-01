import { supabase } from './supabase';

export interface Payment {
  id: string;
  userId: string;
  serviceId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentData {
  serviceId: string;
  amount: number;
  paymentMethod: Payment['paymentMethod'];
  metadata?: Record<string, any>;
}

class PaymentService {
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: payment, error } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user.id,
            service_id: data.serviceId,
            amount: data.amount,
            payment_method: data.paymentMethod,
            status: 'pending',
            metadata: data.metadata,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapPayment(payment);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.mapPayment(payment);
    } catch (error) {
      console.error('Erro ao obter pagamento:', error);
      throw error;
    }
  }

  async getPayments(): Promise<Payment[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return payments.map(this.mapPayment);
    } catch (error) {
      console.error('Erro ao obter pagamentos:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapPayment(payment);
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      throw error;
    }
  }

  async refundPayment(id: string): Promise<Payment> {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapPayment(payment);
    } catch (error) {
      console.error('Erro ao reembolsar pagamento:', error);
      throw error;
    }
  }

  private mapPayment(payment: any): Payment {
    return {
      id: payment.id,
      userId: payment.user_id,
      serviceId: payment.service_id,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.payment_method,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
      metadata: payment.metadata,
    };
  }
}

export const paymentService = new PaymentService(); 