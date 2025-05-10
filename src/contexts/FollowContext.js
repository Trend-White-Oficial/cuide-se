import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollowing();
        subscribeToFollows();
    }, []);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('seguimentos')
                .select(`
                    *,
                    seguido:seguido_id (
                        nome_completo,
                        foto_perfil_url,
                        especialidade
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setFollowing(data);
        } catch (error) {
            console.error('Erro ao carregar seguimentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async (seguidoId) => {
        try {
            const { data, error } = await supabase
                .from('seguimentos')
                .select()
                .eq('seguidor_id', supabase.auth.user().id)
                .eq('seguido_id', seguidoId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                // Remover seguimento
                const { error: deleteError } = await supabase
                    .from('seguimentos')
                    .delete()
                    .eq('seguidor_id', supabase.auth.user().id)
                    .eq('seguido_id', seguidoId);

                if (deleteError) throw deleteError;
            } else {
                // Adicionar seguimento
                const { error: insertError } = await supabase
                    .from('seguimentos')
                    .insert({
                        seguidor_id: supabase.auth.user().id,
                        seguido_id: seguidoId,
                        data_criacao: new Date().toISOString()
                    });

                if (insertError) throw insertError;

                // Enviar notificação para o seguido
                await supabase
                    .from('notificacoes')
                    .insert({
                        perfil_id: seguidoId,
                        titulo: 'Novo Seguidor',
                        mensagem: `${user.nome_completo} começou a seguir você`,
                        tipo: 'seguidor'
                    });
            }

            fetchFollowing();
        } catch (error) {
            console.error('Erro ao alterar seguimento:', error);
        }
    };

    const subscribeToFollows = () => {
        const channel = supabase.channel('follows')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'seguimentos'
                },
                (payload) => {
                    fetchFollowing();
                }
            )
            .subscribe();
    };

    return (
        <FollowContext.Provider
            value={{
                following,
                loading,
                fetchFollowing,
                toggleFollow
            }}
        >
            {children}
        </FollowContext.Provider>
    );
};
