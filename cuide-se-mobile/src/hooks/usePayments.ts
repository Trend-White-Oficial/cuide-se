import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

interface Payment {
  id: string;
  user_id: string;
  appointment_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  payment_details: {
    card_last_four?: string;
    card_brand?: string;
    pix_code?: string;
    bank_transfer_info?: {
      bank: string;
      agency: string;
      account: string;
    };
  };
  created_at: string;
  updated_at: string;
}

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: Error | null;
}

interface CreatePaymentData {
  appointment_id: string;
  amount: number;
  payment_method: Payment['payment_method'];
  payment_details: Payment['payment_details'];
}

export const usePayments = () => {
  const [state, setState] = useState<PaymentState>({
    payments: [],
    loading: false,
    error: null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  // Carrega os pagamentos do usuário
  const loadPayments = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        payments: data as Payment[],
        loading: false,
      }));

      // Registra o evento
      await logEvent('payments_loaded', {
        user_id: user.id,
        count: data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar pagamentos'));
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao carregar pagamentos'),
        loading: false,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao carregar pagamentos',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [user, logEvent, showToast, recordError]);

  // Cria um novo pagamento
  const createPayment = useCallback(
    async (data: CreatePaymentData): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data: payment, error } = await supabase
          .from('payments')
          .insert([
            {
              user_id: user.id,
              ...data,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          payments: [payment as Payment, ...prev.payments],
          loading: false,
        }));

        // Registra o evento
        await logEvent('payment_created', {
          user_id: user.id,
          appointment_id: data.appointment_id,
          amount: data.amount,
          payment_method: data.payment_method,
        });

        showToast({
          type: 'success',
          message: 'Pagamento iniciado',
          description: 'Seu pagamento está sendo processado',
        });
      } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao criar pagamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao criar pagamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao criar pagamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  // Atualiza o status de um pagamento
  const updatePaymentStatus = useCallback(
    async (id: string, status: Payment['status']): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('payments')
          .update({ status })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          payments: prev.payments.map(payment =>
            payment.id === id ? (data as Payment) : payment
          ),
          loading: false,
        }));

        // Registra o evento
        await logEvent('payment_status_updated', {
          user_id: user.id,
          payment_id: id,
          status,
        });

        showToast({
          type: 'success',
          message: 'Status do pagamento atualizado',
          description: `O pagamento foi ${status}`,
        });
      } catch (error) {
        console.error('Erro ao atualizar status do pagamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar status do pagamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar status do pagamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar status do pagamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  // Solicita reembolso de um pagamento
  const requestRefund = useCallback(
    async (id: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('payments')
          .update({ status: 'refunded' })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          payments: prev.payments.map(payment =>
            payment.id === id ? (data as Payment) : payment
          ),
          loading: false,
        }));

        // Registra o evento
        await logEvent('payment_refunded', {
          user_id: user.id,
          payment_id: id,
        });

        showToast({
          type: 'success',
          message: 'Reembolso solicitado',
          description: 'Seu reembolso está sendo processado',
        });
      } catch (error) {
        console.error('Erro ao solicitar reembolso:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao solicitar reembolso'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao solicitar reembolso'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao solicitar reembolso',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  return {
    ...state,
    loadPayments,
    createPayment,
    updatePaymentStatus,
    requestRefund,
  };
}; 