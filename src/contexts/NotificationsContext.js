import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        subscribeToNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('notificacoes')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .eq('lida', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            setNotifications(data);
            setUnreadCount(data.length);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notificacoes')
                .update({ lida: true })
                .eq('id', notificationId);

            if (error) throw error;
            
            fetchNotifications();
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notificacoes')
                .update({ lida: true })
                .eq('lida', false);

            if (error) throw error;
            
            fetchNotifications();
        } catch (error) {
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
