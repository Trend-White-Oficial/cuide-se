/**
 * Contexto para gerenciamento de notificações do usuário
 * 
 * Este contexto gerencia todas as operações relacionadas a notificações,
 * incluindo busca, marcação como lida e gerenciamento de erros.
 */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - notifications: Array de notificações não lidas
     * - unreadCount: Contador de notificações não lidas
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();
        subscribeToNotifications();
    }, []);

    /**
     * Busca notificações não lidas do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('notificacoes')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .eq('usuario_id', user.id)
                .eq('lida', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setNotifications(data || []);
            setUnreadCount(data?.length || 0);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar notificações');
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Marca uma notificação como lida
     * 
     * @param {string} notificationId - ID da notificação a ser marcada
     * @returns {Promise<void>}
     */
    const markAsRead = async (notificationId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('notificacoes')
                .update({ lida: true })
                .eq('id', notificationId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => prev - 1);
            toast.success('Notificação marcada como lida');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao marcar notificação como lida');
            console.error('Erro ao marcar notificação como lida:', error);
        }
    };

    /**
     * Marca todas as notificações como lidas
     * 
     * @returns {Promise<void>}
     */
    const markAllAsRead = async () => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('notificacoes')
                .update({ lida: true })
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            setNotifications([]);
            setUnreadCount(0);
            toast.success('Todas as notificações foram marcadas como lidas');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao marcar todas as notificações como lidas');
            console.error('Erro ao marcar todas as notificações como lidas:', error);
        }
    };

    const subscribeToNotifications = () => {
        const channel = supabase.channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notificacoes'
                },
                (payload) => {
                    fetchNotifications();
                }
            )
            .subscribe();
    };

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                fetchNotifications,
                markAsRead,
                markAllAsRead
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};
