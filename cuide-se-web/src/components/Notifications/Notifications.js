import React, { useState, useEffect } from 'react';
import { apiNotificacoes } from '../../api/notifications';
import { useAuth } from '../../contexts/AuthContext';
import PushNotification from 'react-native-push-notification';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        subscribeToNotifications();
        setupPushNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await apiNotificacoes.listNotifications(user.id);
            if (error) throw error;
            
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.lido).length);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupPushNotifications = () => {
        PushNotification.configure({
            onRegister: function (token) {
                // Salvar token do dispositivo
                apiNotificacoes.updateDeviceToken(user.id, token.token);
            },
            onNotification: function (notification) {
                // Exibir notificação
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    };

    const subscribeToNotifications = () => {
        const channel = supabase.channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notificacoes',
                    filter: `perfil_id=eq.${user.id}`
                },
                (payload) => {
                    fetchNotifications();
                    
                    // Enviar notificação push
                    PushNotification.localNotification({
                        title: payload.new.titulo,
                        message: payload.new.mensagem,
                        date: new Date(payload.new.created_at),
                        priority: 'high',
                        importance: 'high',
                        vibrate: true,
                        vibration: 300
                    });
                }
            )
            .subscribe();
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await apiNotificacoes.markAsRead(notificationId);
            if (error) throw error;
            
            setNotifications(prev => prev.map(n => 
                n.id === notificationId ? { ...n, lido: true } : n
            ));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await apiNotificacoes.markAllAsRead(user.id);
            if (error) throw error;
            
            setNotifications(prev => prev.map(n => ({ ...n, lido: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h1>Notificações</h1>
                <div className="header-actions">
                    <span className="unread-count">{unreadCount} não lidas</span>
                    <button onClick={markAllAsRead}>Marcar todas como lidas</button>
                </div>
            </div>

            <div className="notifications-list">
                {loading ? (
                    <div>Carregando...</div>
                ) : notifications.length === 0 ? (
                    <div>Nenhuma notificação</div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification ${notification.lido ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="notification-content">
                                <h3>{notification.titulo}</h3>
                                <p>{notification.mensagem}</p>
                                <div className="notification-meta">
                                    <span className="type">{notification.tipo}</span>
                                    <span className="date">
                                        {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                            {!notification.lido && (
                                <div className="unread-marker" />
                            )}
                        </div>
                    ))
                )}
            </div>

            <style jsx>{`
                .notifications-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .notifications-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .unread-count {
                    background: #4CAF50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-weight: bold;
                }

                .notifications-list {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .notification {
                    display: flex;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .notification:hover {
                    background-color: #f8f9fa;
                }

                .notification-content {
                    flex: 1;
                }

                .notification h3 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .notification p {
                    margin: 0 0 10px 0;
                    color: #666;
                }

                .notification-meta {
                    display: flex;
                    gap: 15px;
                    font-size: 12px;
                    color: #888;
                }

                .type {
                    background: #e9ecef;
                    padding: 3px 8px;
                    border-radius: 4px;
                }

                .unread-marker {
                    width: 6px;
                    height: 100%;
                    background: #4CAF50;
                    border-radius: 3px;
                }

                .unread {
                    background-color: #f8f9fa;
                }

                @media (max-width: 768px) {
                    .notifications-header {
                        flex-direction: column;
                        gap: 10px;
                    }

                    .header-actions {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Notifications;
