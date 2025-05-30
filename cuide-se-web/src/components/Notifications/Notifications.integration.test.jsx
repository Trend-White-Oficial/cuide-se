import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Notifications } from './Notifications';
import { AuthProvider } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do supabase
vi.mock('../../services/supabaseService', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis()
    }
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
        vi.clearAllMocks();
        
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
            <AuthProvider value={{ user: mockUser }}>
                <Notifications />
            </AuthProvider>
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
            <AuthProvider value={{ user: mockUser }}>
                <Notifications />
            </AuthProvider>
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
            <AuthProvider value={{ user: mockUser }}>
                <Notifications />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar notificações')).toBeInTheDocument();
        });
    });

    it('should show loading state while fetching', async () => {
        supabase.select.mockResolvedValue({ data: mockNotifications });

        const { container } = render(
            <AuthProvider value={{ user: mockUser }}>
                <Notifications />
            </AuthProvider>
        );

        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Nova Promoção')).toBeInTheDocument();
        });
    });
});
