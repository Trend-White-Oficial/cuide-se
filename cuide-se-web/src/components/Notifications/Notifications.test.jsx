import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Notifications } from './Notifications';
import { NotificationsContext } from '../../contexts/NotificationsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockNotifications = [
    {
        id: 1,
        title: 'Notificação 1',
        message: 'Mensagem da notificação 1',
        read: false,
        created_at: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 2,
        title: 'Notificação 2',
        message: 'Mensagem da notificação 2',
        read: true,
        created_at: '2024-01-02T00:00:00.000Z'
    }
];

const mockNotificationsService = {
    fetchNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn()
};

describe('Notifications Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        notifications: mockNotifications,
        unreadCount: 1,
        loading: false,
        fetchNotifications: mockNotificationsService.fetchNotifications,
        markAsRead: mockNotificationsService.markAsRead,
        markAllAsRead: mockNotificationsService.markAllAsRead
    };

    const mockAuthContext = {
        user: mockUser
    };

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                <NotificationsContext.Provider value={mockContext}>
                    <Notifications />
                </NotificationsContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('should render notifications list', () => {
        renderComponent();
        
        expect(screen.getByText('Notificação 1')).toBeInTheDocument();
        expect(screen.getByText('Notificação 2')).toBeInTheDocument();
    });

    it('should show correct unread count', () => {
        renderComponent();
        
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should call markAsRead when notification is clicked', async () => {
        renderComponent();
        
        const notification = screen.getByText('Notificação 1');
        fireEvent.click(notification);
        
        await waitFor(() => {
            expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith(1);
        });
    });

    it('should call markAllAsRead when all button is clicked', async () => {
        renderComponent();
        
        const allButton = screen.getByText('Marcar Todos como Lidos');
        fireEvent.click(allButton);
        
        await waitFor(() => {
            expect(mockNotificationsService.markAllAsRead).toHaveBeenCalled();
        });
    });

    it('should show loading state', () => {
        const loadingContext = { ...mockContext, loading: true };
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <NotificationsContext.Provider value={loadingContext}>
                    <Notifications />
                </NotificationsContext.Provider>
            </AuthContext.Provider>
        );
        
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
});
