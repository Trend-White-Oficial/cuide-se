import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notifications from './Notifications';
import { NotificationsContext } from '../../contexts/NotificationsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

jest.mock('../../supabase', () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis()
}));

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

describe('Notifications Integration Tests', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        
        supabase.from.mockReturnValue(supabase);
        supabase.select.mockReturnValue(supabase);
        supabase.insert.mockReturnValue(supabase);
        supabase.update.mockReturnValue(supabase);
        supabase.delete.mockReturnValue(supabase);
        supabase.eq.mockReturnValue(supabase);
        supabase.gte.mockReturnValue(supabase);
        supabase.order.mockReturnValue(supabase);
        supabase.single.mockReturnValue(supabase);
    });

    it('should fetch notifications on mount', async () => {
        supabase.select.mockResolvedValue({ data: mockNotifications });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Notifications />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('notificacoes');
            expect(supabase.select).toHaveBeenCalledWith(`
                *,
                perfil:perfil_id (
                    nome_completo,
                    foto_perfil_url
                )
            `);
            expect(supabase.eq).toHaveBeenCalledWith('lida', false);
            expect(supabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
        });

        expect(screen.getByText('Nova Promoção')).toBeInTheDocument();
        expect(screen.getByText('Novo Seguidor')).toBeInTheDocument();
    });

    it('should mark notification as read', async () => {
        supabase.select.mockResolvedValue({ data: mockNotifications });
        supabase.update.mockResolvedValue({ error: null });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Notifications />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('notificacoes');
        });

        const notification = screen.getByText('Nova Promoção');
        fireEvent.click(notification);

        await waitFor(() => {
            expect(supabase.update).toHaveBeenCalledWith({ lida: true });
            expect(supabase.eq).toHaveBeenCalledWith('id', 1);
        });
    });

    it('should handle API errors gracefully', async () => {
        supabase.select.mockResolvedValue({ error: new Error('API Error') });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Notifications />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar notificações')).toBeInTheDocument();
        });
    });

    it('should show loading state while fetching', async () => {
        supabase.select.mockResolvedValue({ data: mockNotifications });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Notifications />
            </AuthContext.Provider>
        );

        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nova Promoção')).toBeInTheDocument();
        });
    });
});
