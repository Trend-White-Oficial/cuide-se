import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Follow from './Follow';
import { FollowContext } from '../../contexts/FollowContext';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

jest.mock('../../supabase', () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis()
}));

const mockFollowing = [
    {
        id: 1,
        seguido_id: '456',
        seguido: {
            nome_completo: 'Profissional A',
            foto_perfil_url: 'https://example.com/profissional-a.jpg',
            especialidade: 'Manicure'
        },
        created_at: '2024-05-09T18:56:00.000Z'
    }
];

describe('Follow Integration Tests', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        
        supabase.from.mockReturnValue(supabase);
        supabase.select.mockReturnValue(supabase);
        supabase.insert.mockReturnValue(supabase);
        supabase.delete.mockReturnValue(supabase);
        supabase.eq.mockReturnValue(supabase);
        supabase.single.mockReturnValue(supabase);
    });

    it('should fetch following on mount', async () => {
        supabase.select.mockResolvedValue({ data: mockFollowing });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('seguimentos');
            expect(supabase.select).toHaveBeenCalledWith(`
                *,
                seguido:seguido_id (
                    nome_completo,
                    foto_perfil_url,
                    especialidade
                )
            `);
            expect(supabase.eq).toHaveBeenCalledWith('seguidor_id', '123');
            expect(supabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
        });

        expect(screen.getByText('Seguindo')).toBeInTheDocument();
    });

    it('should toggle follow/unfollow', async () => {
        supabase.select.mockResolvedValue({ data: [] });
        supabase.insert.mockResolvedValue({ error: null });
        supabase.delete.mockResolvedValue({ error: null });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Seguir')).toBeInTheDocument();
        });

        const followButton = screen.getByText('Seguir');
        fireEvent.click(followButton);

        await waitFor(() => {
            expect(supabase.insert).toHaveBeenCalledWith({
                seguidor_id: '123',
                seguido_id: '456',
                data_criacao: expect.any(String)
            });
        });

        // Simulate follow state
        supabase.select.mockResolvedValue({ data: mockFollowing });
        
        const unfollowButton = screen.getByText('Seguindo');
        fireEvent.click(unfollowButton);

        await waitFor(() => {
            expect(supabase.delete).toHaveBeenCalledWith();
            expect(supabase.eq).toHaveBeenCalledWith('seguidor_id', '123');
            expect(supabase.eq).toHaveBeenCalledWith('seguido_id', '456');
        });
    });

    it('should handle API errors gracefully', async () => {
        supabase.select.mockResolvedValue({ error: new Error('API Error') });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar seguimentos')).toBeInTheDocument();
        });
    });

    it('should show loading state while fetching', async () => {
        supabase.select.mockResolvedValue({ data: mockFollowing });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
            </AuthContext.Provider>
        );

        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Seguindo')).toBeInTheDocument();
        });
    });
});
