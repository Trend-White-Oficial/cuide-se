/**
 * Contexto para gerenciamento de pagamentos
 * 
 * Este contexto gerencia todas as operações relacionadas a pagamentos,
 * incluindo criação, verificação e gerenciamento de transações.
 */

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { useStripe } from '@stripe/stripe-react-native';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - transactions: Array de transações do usuário
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const stripe = useStripe();

    useEffect(() => {
        fetchTransactions();
    }, []);

    /**
     * Busca transações do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('transacoes')
                .select(`
                    *,
                    agendamento:agendamento_id (
                        servico:servico_id (
                            nome,
                            preco
                        ),
                        profissional:profissional_id (
                            nome_completo,
                            foto_perfil_url
                        )
                    )
                `)
                .eq('usuario_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setTransactions(data || []);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar transações');
            console.error('Erro ao carregar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Inicia uma nova transação
     * 
     * @param {Object} transactionData - Dados da transação
     * @param {string} transactionData.agendamentoId - ID do agendamento
     * @param {number} transactionData.amount - Valor da transação
     * @returns {Promise<void>}
     */
    const createTransaction = async (transactionData) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Criar sessão no Stripe
            const { data: sessionData, error: sessionError } = await supabase
                .rpc('create_payment_session', {
                    amount: transactionData.amount,
                    agendamento_id: transactionData.agendamentoId,
                    user_id: user.id
                });

            if (sessionError) throw sessionError;

            // Iniciar pagamento com Stripe
            const { error: stripeError } = await stripe.initPaymentSheet({
                customerId: sessionData.customer_id,
                customerEphemeralKeySecret: sessionData.ephemeral_key,
                paymentIntentClientSecret: sessionData.payment_intent,
            });

            if (stripeError) throw stripeError;

            // Apresentar a tela de pagamento
            const { error: presentError } = await stripe.presentPaymentSheet();

            if (presentError) throw presentError;

            // Atualizar status do agendamento
            const { error: updateError } = await supabase
                .from('agendamentos')
                .update({ status: 'pago' })
                .eq('id', transactionData.agendamentoId);

            if (updateError) throw updateError;

            fetchTransactions();
            toast.success('Pagamento realizado com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao processar pagamento');
            console.error('Erro ao processar pagamento:', error);
        }
    };

    /**
     * Cancela uma transação
     * 
     * @param {string} transactionId - ID da transação a ser cancelada
     * @returns {Promise<void>}
     */
    const cancelTransaction = async (transactionId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('transacoes')
                .update({ status: 'cancelado' })
                .eq('id', transactionId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchTransactions();
            toast.success('Transação cancelada com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao cancelar transação');
            console.error('Erro ao cancelar transação:', error);
        }
    };

    /**
     * Refunde uma transação
     * 
     * @param {string} transactionId - ID da transação a ser reembolsada
     * @returns {Promise<void>}
     */
    const refundTransaction = async (transactionId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            // Chamar função RPC para reembolso no Stripe
            const { error: refundError } = await supabase
                .rpc('refund_transaction', {
                    transaction_id: transactionId
                });

            if (refundError) throw refundError;

            // Atualizar status da transação
            const { error: updateError } = await supabase
                .from('transacoes')
                .update({ status: 'reembolsado' })
                .eq('id', transactionId)
                .eq('usuario_id', user.id);

            if (updateError) throw updateError;

            fetchTransactions();
            toast.success('Reembolso realizado com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao processar reembolso');
            console.error('Erro ao processar reembolso:', error);
        }
    };

    return (
        <PaymentContext.Provider
            value={{
                transactions,
                loading,
                error,
                fetchTransactions,
                createTransaction,
                cancelTransaction,
                refundTransaction
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};
