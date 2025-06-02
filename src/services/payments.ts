import { supabase } from './supabase';
import { Payment } from '../types';

export interface CreatePaymentData {
  appointmentId: string;
  amount: number;
  paymentMethod: Payment['payment_method'];
  paymentDetails?: Payment['payment_details'];
  metadata?: Record<string, any>;
}

class PaymentService {
  private mapPayment(data: any): Payment {
    return {
      id: data.id,
      user_id: data.user_id,
      appointment_id: data.appointment_id,
      amount: data.amount,
      status: data.status,
      payment_method: data.payment_method,
      payment_details: data.payment_details,
      created_at: data.created_at,
      updated_at: data.updated_at,
      metadata: data.metadata
    };
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: payment, error } = await supabase
        .from('payments')
        .insert([
          {
            user_id: user.id,
            appointment_id: data.appointmentId,
            amount: data.amount,
            payment_method: data.paymentMethod,
            payment_details: data.paymentDetails,
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
}

export const paymentService = new PaymentService(); 