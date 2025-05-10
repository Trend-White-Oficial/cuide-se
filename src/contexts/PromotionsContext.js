import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const PromotionsContext = createContext();

export const PromotionsProvider = ({ children }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
        subscribeToPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('promocoes')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url,
                        especialidade
                    )
                `)
                .gte('data_inicio', new Date().toISOString())
                .order('data_inicio', { ascending: true });

            if (error) throw error;
            
            setPromotions(data);
        } catch (error) {
            console.error('Erro ao carregar promoções:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPromotion = async (promotionData) => {
        try {
            const { error } = await supabase
                .from('promocoes')
                .insert({
                    ...promotionData,
                    data_criacao: new Date().toISOString()
                });

            if (error) throw error;
            
            fetchPromotions();
        } catch (error) {
            console.error('Erro ao adicionar promoção:', error);
        }
    };

    const updatePromotion = async (promotionId, promotionData) => {
        try {
            const { error } = await supabase
                .from('promocoes')
                .update(promotionData)
                .eq('id', promotionId);

            if (error) throw error;
            
            fetchPromotions();
        } catch (error) {
            console.error('Erro ao atualizar promoção:', error);
        }
    };

    const deletePromotion = async (promotionId) => {
        try {
            const { error } = await supabase
                .from('promocoes')
                .delete()
                .eq('id', promotionId);

            if (error) throw error;
            
            fetchPromotions();
        } catch (error) {
            console.error('Erro ao deletar promoção:', error);
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
