/**
 * Contexto para gerenciamento de carrinho de agendamentos
 * 
 * Este contexto gerencia todas as operações relacionadas ao carrinho de agendamentos,
 * incluindo adicionar, remover e gerenciar serviços selecionados.
 */

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - items: Array de itens no carrinho
     * - total: Valor total do carrinho
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchCart();
    }, []);

    /**
     * Busca itens do carrinho do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('carrinho')
                .select(`
                    *,
                    servico:servico_id (
                        nome,
                        preco,
                        duracao
                    ),
                    profissional:profissional_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            const itemsData = data || [];
            const totalValue = itemsData.reduce((sum, item) => sum + item.servico.preco, 0);
            
            setItems(itemsData);
            setTotal(totalValue);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar carrinho');
            console.error('Erro ao carregar carrinho:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Adiciona um serviço ao carrinho
     * 
     * @param {Object} item - Dados do item a ser adicionado
     * @param {string} item.servicoId - ID do serviço
     * @param {string} item.profissionalId - ID do profissional
     * @returns {Promise<void>}
     */
    const addToCart = async (item) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('carrinho')
                .insert({
                    usuario_id: user.id,
                    servico_id: item.servicoId,
                    profissional_id: item.profissionalId
                });

            if (error) throw error;
            
            fetchCart();
            toast.success('Serviço adicionado ao carrinho');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao adicionar serviço ao carrinho');
            console.error('Erro ao adicionar serviço ao carrinho:', error);
        }
    };

    /**
     * Remove um item do carrinho
     * 
     * @param {string} itemId - ID do item a ser removido
     * @returns {Promise<void>}
     */
    const removeFromCart = async (itemId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('carrinho')
                .delete()
                .eq('id', itemId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchCart();
            toast.success('Serviço removido do carrinho');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao remover serviço do carrinho');
            console.error('Erro ao remover serviço do carrinho:', error);
        }
    };

    /**
     * Limpa o carrinho
     * 
     * @returns {Promise<void>}
     */
    const clearCart = async () => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('carrinho')
                .delete()
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            setItems([]);
            setTotal(0);
            toast.success('Carrinho limpo com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao limpar carrinho');
            console.error('Erro ao limpar carrinho:', error);
        }
    };

    /**
     * Finaliza o agendamento
     * 
     * @returns {Promise<void>}
     */
    const checkout = async () => {
        try {
            if (!user || items.length === 0) {
                throw new Error('Carrinho vazio ou usuário não autenticado');
            }

            // Criar agendamentos para cada item
            for (const item of items) {
                const { error: agendamentoError } = await supabase
                    .from('agendamentos')
                    .insert({
                        usuario_id: user.id,
                        profissional_id: item.profissional_id,
                        servico_id: item.servico_id,
                        data_hora: new Date().toISOString(),
                        status: 'agendado',
                        valor: item.servico.preco
                    });

                if (agendamentoError) throw agendamentoError;
            }

            // Limpar carrinho após finalizar
            await clearCart();
            toast.success('Agendamentos realizados com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao finalizar agendamentos');
            console.error('Erro ao finalizar agendamentos:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                loading,
                error,
                fetchCart,
                addToCart,
                removeFromCart,
                clearCart,
                checkout
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
