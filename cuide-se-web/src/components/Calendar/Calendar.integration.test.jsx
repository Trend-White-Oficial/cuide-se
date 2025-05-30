import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calendar } from './Calendar';
import { AuthProvider } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do supabase
vi.mock('../../services/supabaseService', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis()
    }
}));

const mockEvents = [
    {
        id: 1,
        titulo: 'Consulta de Manutenção',
        data_inicio: '2024-05-10T14:00:00.000Z',
        data_fim: '2024-05-10T15:00:00.000Z',
        perfil: {
            nome_completo: 'Profissional Teste',
            foto_perfil_url: 'https://example.com/profile.jpg'
        }
    }
];

describe('Calendar Integration Tests', () => {
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
        supabase.gte.mockReturnValue(supabase);
        supabase.order.mockReturnValue(supabase);
    });

    it('should fetch events on mount', async () => {
        supabase.select.mockResolvedValue({ data: mockEvents });

        const { container } = render(
            <AuthProvider value={{ user: mockUser }}>
                <Calendar />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('eventos');
            expect(supabase.select).toHaveBeenCalledWith(`
                *,
                perfil:perfil_id (
                    nome_completo,
                    foto_perfil_url
                )
            `);
            expect(supabase.gte).toHaveBeenCalledWith('data_inicio', expect.any(String));
            expect(supabase.order).toHaveBeenCalledWith('data_inicio', { ascending: true });
        });

        expect(screen.getByText('Consulta de Manutenção')).toBeInTheDocument();
    });

    it('should add new event', async () => {
        supabase.select.mockResolvedValue({ data: mockEvents });
        supabase.insert.mockResolvedValue({ error: null });

        const { container } = render(
            <AuthProvider value={{ user: mockUser }}>
                <Calendar />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('eventos');
        });

        const addEventButton = screen.getByText('Adicionar Evento');
        fireEvent.click(addEventButton);

        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Novo Evento' } });

        const saveButton = screen.getByText('Salvar');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(supabase.insert).toHaveBeenCalledWith({
                titulo: 'Novo Evento',
                data_criacao: expect.any(String)
            });
        });
    });

    it('should handle API errors gracefully', async () => {
        supabase.select.mockResolvedValue({ error: new Error('API Error') });

        const { container } = render(
            <AuthProvider value={{ user: mockUser }}>
                <Calendar />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar eventos')).toBeInTheDocument();
        });
    });

    it('should show loading state while fetching', async () => {
        supabase.select.mockResolvedValue({ data: mockEvents });

        const { container } = render(
            <AuthProvider value={{ user: mockUser }}>
                <Calendar />
            </AuthProvider>
        );

        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Consulta de Manutenção')).toBeInTheDocument();
        });
    });
});
