import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notifications from './Notifications';
import { NotificationsContext } from '../../contexts/NotificationsContext';
import { AuthContext } from '../../contexts/AuthContext';

const mockNotifications = [
    {
        id: 1,
        titulo: 'Nova Promoção',
        mensagem: 'Você tem uma nova promoção disponível',
        lida: false,
        created_at: '2024-05-09T18:56:00.000Z'
    },
    {
        id: 2,
        titulo: 'Novo Seguidor',
        mensagem: 'Usuário X começou a seguir você',
        lida: true,
        created_at: '2024-05-08T18:56:00.000Z'
    }
];

describe('Notifications Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        notifications: mockNotifications,
        unreadCount: 1,
        loading: false,
        fetchNotifications: jest.fn(),
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn()
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
        
        expect(screen.getByText('Nova Promoção')).toBeInTheDocument();
        expect(screen.getByText('Novo Seguidor')).toBeInTheDocument();
    });

    it('should show correct unread count', () => {
        renderComponent();
        
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should call markAsRead when notification is clicked', async () => {
        renderComponent();
        
        const notification = screen.getByText('Nova Promoção');
        fireEvent.click(notification);
        
        await waitFor(() => {
            expect(mockContext.markAsRead).toHaveBeenCalledWith(1);
        });
    });

    it('should call markAllAsRead when all button is clicked', async () => {
        renderComponent();
        
        const allButton = screen.getByText('Marcar Todos como Lidos');
        fireEvent.click(allButton);
        
        await waitFor(() => {
            expect(mockContext.markAllAsRead).toHaveBeenCalled();
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
