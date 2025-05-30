import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Follow } from './Follow';
import { FollowContext } from '../../contexts/FollowContext';
import { AuthContext } from '../../contexts/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
    },
    {
        id: 2,
        seguido_id: '789',
        seguido: {
            nome_completo: 'Profissional B',
            foto_perfil_url: 'https://example.com/profissional-b.jpg',
            especialidade: 'Cabeleireiro'
        },
        created_at: '2024-05-08T18:56:00.000Z'
    }
];

const mockFollowService = {
    fetchFollowing: vi.fn(),
    toggleFollow: vi.fn()
};

describe('Follow Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        following: mockFollowing,
        loading: false,
        fetchFollowing: mockFollowService.fetchFollowing,
        toggleFollow: mockFollowService.toggleFollow
    };

    const mockAuthContext = {
        user: mockUser
    };

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                <FollowContext.Provider value={mockContext}>
                    <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
                </FollowContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('should render follow button for non-followed professional', () => {
        const mockNonFollowingContext = { ...mockContext, following: [] };
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <FollowContext.Provider value={mockNonFollowingContext}>
                    <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
                </FollowContext.Provider>
            </AuthContext.Provider>
        );
        
        expect(screen.getByText('Seguir')).toBeInTheDocument();
    });

    it('should render unfollow button for followed professional', () => {
        renderComponent();
        
        expect(screen.getByText('Seguindo')).toBeInTheDocument();
    });

    it('should call toggleFollow when follow button is clicked', async () => {
        renderComponent();
        
        const followButton = screen.getByText('Seguindo');
        fireEvent.click(followButton);
        
        await waitFor(() => {
            expect(mockContext.toggleFollow).toHaveBeenCalledWith('456');
        });
    });

    it('should show loading state', () => {
        const loadingContext = { ...mockContext, loading: true };
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <FollowContext.Provider value={loadingContext}>
                    <Follow perfilId="456" perfil={{ nome_completo: 'Profissional A' }} />
                </FollowContext.Provider>
            </AuthContext.Provider>
        );
        
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('should show professional information', () => {
        renderComponent();
        
        expect(screen.getByText('Profissional A')).toBeInTheDocument();
    });
});
