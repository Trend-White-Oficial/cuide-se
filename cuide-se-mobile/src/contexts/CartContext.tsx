import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import { Alert } from 'react-native';

interface CartItem {
  id: string;
  servico_id: string;
  profissional_id: string;
  servico: {
    id: string;
    nome: string;
    preco: number;
    duracao: number;
  };
  profissional: {
    id: string;
    nome_completo: string;
    foto_perfil_url: string;
  };
}

interface CartContextData {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (item: { servicoId: string; profissionalId: string }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
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
      Alert.alert('Erro', 'Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: { servicoId: string; profissionalId: string }) => {
    try {
      const { error } = await supabase
        .from('carrinho')
        .insert({
          servico_id: item.servicoId,
          profissional_id: item.profissionalId,
          data_criacao: new Date().toISOString()
        });

      if (error) throw error;
      Alert.alert('Sucesso', 'Item adicionado ao carrinho');
      fetchCart();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', 'Erro ao adicionar ao carrinho');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('carrinho')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      Alert.alert('Sucesso', 'Item removido do carrinho');
      fetchCart();
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      Alert.alert('Erro', 'Erro ao remover do carrinho');
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
      Alert.alert('Sucesso', 'Carrinho limpo');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      Alert.alert('Erro', 'Erro ao limpar carrinho');
    }
  };

  const checkout = async () => {
    try {
      const { data: agendamento, error: agendamentoError } = await supabase
        .from('agendamentos')
        .insert({
          data_criacao: new Date().toISOString(),
          status: 'pendente'
        })
        .select()
        .single();

      if (agendamentoError) throw agendamentoError;

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

      await clearCart();
      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
      Alert.alert('Erro', 'Erro ao finalizar agendamento');
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
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}; 