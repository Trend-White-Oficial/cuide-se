import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('carrinho')
                .select(`
                    *,
                    servico:servico_id (
                        id,
                        nome,
                        preco,
                        duracao
                    ),
                    profissional:profissional_id (
                        id,
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            toast.error('Erro ao carregar carrinho');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (item) => {
        try {
            const { error } = await supabase
                .from('carrinho')
                .insert({
                    servico_id: item.servicoId,
                    profissional_id: item.profissionalId,
                    data_criacao: new Date().toISOString()
                });

            if (error) throw error;
            toast.success('Item adicionado ao carrinho');
            fetchCart();
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            toast.error('Erro ao adicionar ao carrinho');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const { error } = await supabase
                .from('carrinho')
                .delete()
                .eq('id', itemId);

            if (error) throw error;
            toast.success('Item removido do carrinho');
            fetchCart();
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            toast.error('Erro ao remover do carrinho');
        }
    };

    const clearCart = async () => {
        try {
            const { error } = await supabase
                .from('carrinho')
                .delete()
                .neq('id', 0);

            if (error) throw error;
            setItems([]);
            toast.success('Carrinho limpo');
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            toast.error('Erro ao limpar carrinho');
        }
    };

    const checkout = async () => {
        try {
            // Primeiro, criar o agendamento
            const { data: agendamento, error: agendamentoError } = await supabase
                .from('agendamentos')
                .insert({
                    data_criacao: new Date().toISOString(),
                    status: 'pendente'
                })
                .select()
                .single();

            if (agendamentoError) throw agendamentoError;

            // Depois, criar os itens do agendamento
            const itensAgendamento = items.map(item => ({
                agendamento_id: agendamento.id,
                servico_id: item.servico_id,
                profissional_id: item.profissional_id,
                preco: item.servico.preco,
                duracao: item.servico.duracao
            }));

            const { error: itensError } = await supabase
                .from('itens_agendamento')
                .insert(itensAgendamento);

            if (itensError) throw itensError;

            // Por fim, limpar o carrinho
            await clearCart();
            toast.success('Agendamento realizado com sucesso!');
        } catch (error) {
            console.error('Erro ao finalizar agendamento:', error);
            toast.error('Erro ao finalizar agendamento');
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            loading,
            fetchCart,
            addToCart,
            removeFromCart,
            clearCart,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
} 