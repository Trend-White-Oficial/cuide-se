/**
 * Contexto para gerenciamento de seguimentos
 * 
 * Este contexto gerencia todas as operações relacionadas a seguimentos,
 * incluindo busca, seguimento e remoção de profissionais.
 */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - following: Array de profissionais seguidos
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchFollowing();
        subscribeToFollows();
    }, []);

    /**
     * Busca profissionais seguidos pelo usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchFollowing = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

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
                .eq('seguidor_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setFollowing(data || []);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar seguimentos');
            console.error('Erro ao carregar seguimentos:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Segue um novo profissional
     * 
     * @param {string} professionalId - ID do profissional a ser seguido
     * @returns {Promise<void>}
     */
    const followProfessional = async (professionalId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('seguimentos')
                .insert({
                    seguidor_id: user.id,
                    seguido_id: professionalId
                });

            if (error) throw error;
            
            fetchFollowing();
            toast.success('Profissional seguido com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao seguir profissional');
            console.error('Erro ao seguir profissional:', error);
        }
    };

    /**
     * Deixa de seguir um profissional
     * 
     * @param {string} professionalId - ID do profissional a ser removido dos seguimentos
     * @returns {Promise<void>}
     */
    const unfollowProfessional = async (professionalId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('seguimentos')
                .delete()
                .eq('seguidor_id', user.id)
                .eq('seguido_id', professionalId);

            if (error) throw error;
            
            fetchFollowing();
            toast.success('Profissional removido dos seguimentos');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao remover profissional dos seguimentos');
            console.error('Erro ao remover profissional dos seguimentos:', error);
        }
    };

    /**
     * Alterna entre seguir e deixar de seguir um profissional
     * 
     * @param {string} seguidoId - ID do profissional a ser seguido ou removido dos seguimentos
     * @returns {Promise<void>}
     */
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
