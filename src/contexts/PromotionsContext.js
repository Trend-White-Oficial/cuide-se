/**
 * Contexto para gerenciamento de promoções
 * 
 * Este contexto gerencia todas as operações relacionadas a promoções,
 * incluindo busca, criação, atualização e remoção de promoções.
 */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const PromotionsContext = createContext();

export const PromotionsProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - promotions: Array de promoções do usuário
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchPromotions();
        subscribeToPromotions();
    }, []);

    /**
     * Busca promoções ativas do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('promocoes')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .gte('data_inicio', new Date().toISOString())
                .eq('usuario_id', user.id)
                .order('data_inicio', { ascending: true });

            if (error) throw error;
            
            setPromotions(data || []);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar promoções');
            console.error('Erro ao carregar promoções:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cria uma nova promoção para o usuário
     * 
     * @param {Object} promotionData - Dados da nova promoção
     * @returns {Promise<void>}
     */
    const createPromotion = async (promotionData) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('promocoes')
                .insert([{
                    ...promotionData,
                    usuario_id: user.id
                }]);

            if (error) throw error;
            
            fetchPromotions();
            toast.success('Promoção criada com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao criar promoção');
            console.error('Erro ao criar promoção:', error);
        }
    };

    /**
     * Atualiza uma promoção existente do usuário
     * 
     * @param {string} promotionId - ID da promoção a ser atualizada
     * @param {Object} promotionData - Novos dados da promoção
     * @returns {Promise<void>}
     */
    const updatePromotion = async (promotionId, promotionData) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('promocoes')
                .update({
                    ...promotionData,
                    usuario_id: user.id
                })
                .eq('id', promotionId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchPromotions();
            toast.success('Promoção atualizada com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao atualizar promoção');
            console.error('Erro ao atualizar promoção:', error);
        }
    };

    /**
     * Remove uma promoção do usuário
     * 
     * @param {string} promotionId - ID da promoção a ser removida
     * @returns {Promise<void>}
     */
    const deletePromotion = async (promotionId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('promocoes')
                .delete()
                .eq('id', promotionId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchPromotions();
            toast.success('Promoção removida com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao remover promoção');
            console.error('Erro ao remover promoção:', error);
        }
    };

    const subscribeToPromotions = () => {
        const channel = supabase.channel('promotions')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'promocoes'
                },
                (payload) => {
                    fetchPromotions();
                }
            )
            .subscribe();
    };

    return (
        <PromotionsContext.Provider
            value={{
                promotions,
                loading,
                fetchPromotions,
                addPromotion,
                updatePromotion,
                deletePromotion
            }}
        >
            {children}
        </PromotionsContext.Provider>
    );
};
