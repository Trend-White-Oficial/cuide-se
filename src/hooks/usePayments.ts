import { useState, useCallback, useEffect } from 'react';
import { paymentService, CreatePaymentData } from '../services/payments';
import type { Payment } from '../types';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await paymentService.getPayments();
      setPayments(data);
      await logEvent('payments_loaded', {
        user_id: user?.id,
        count: data.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar pagamentos'));
      recordError(err instanceof Error ? err : new Error('Erro ao carregar pagamentos'));
      showToast({
        type: 'error',
        message: 'Erro ao carregar pagamentos',
        description: 'Tente novamente mais tarde',
      } as ToastOptions);
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const createPayment = useCallback(async (data: CreatePaymentData) => {
    try {
      setIsLoading(true);
      setError(null);
      const payment = await paymentService.createPayment(data);
      setPayments(prev => [payment, ...prev]);
      await logEvent('payment_created', {
        user_id: user?.id,
        appointment_id: data.appointmentId,
        amount: data.amount,
        payment_method: data.paymentMethod,
      });
      showToast({
        type: 'success',
        message: 'Pagamento iniciado',
        description: 'Seu pagamento está sendo processado',
      } as ToastOptions);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar pagamento'));
      recordError(err instanceof Error ? err : new Error('Erro ao criar pagamento'));
      showToast({
        type: 'error',
        message: 'Erro ao criar pagamento',
        description: 'Tente novamente mais tarde',
      } as ToastOptions);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const getPaymentById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const payment = await paymentService.getPaymentById(id);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao obter pagamento'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (id: string, status: Payment['status']) => {
    try {
      setIsLoading(true);
      setError(null);
      const payment = await paymentService.updatePaymentStatus(id, status);
      setPayments(prev => prev.map(p => p.id === id ? payment : p));
      await logEvent('payment_status_updated', {
        user_id: user?.id,
        payment_id: id,
        status,
      });
      showToast({
        type: 'success',
        message: 'Status do pagamento atualizado',
        description: `O pagamento foi ${status}`,
      } as ToastOptions);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar status do pagamento'));
      recordError(err instanceof Error ? err : new Error('Erro ao atualizar status do pagamento'));
      showToast({
        type: 'error',
        message: 'Erro ao atualizar status do pagamento',
        description: 'Tente novamente mais tarde',
      } as ToastOptions);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const refundPayment = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const payment = await paymentService.refundPayment(id);
      setPayments(prev => prev.map(p => p.id === id ? payment : p));
      await logEvent('payment_refunded', {
        user_id: user?.id,
        payment_id: id,
      });
      showToast({
        type: 'success',
        message: 'Reembolso solicitado',
        description: 'Seu reembolso está sendo processado',
      } as ToastOptions);
      return payment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao reembolsar pagamento'));
      recordError(err instanceof Error ? err : new Error('Erro ao reembolsar pagamento'));
      showToast({
        type: 'error',
        message: 'Erro ao reembolsar pagamento',
        description: 'Tente novamente mais tarde',
      } as ToastOptions);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, fetchPayments]);

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    createPayment,
    getPaymentById,
    updatePaymentStatus,
    refundPayment,
  };
}; 