import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Promotions from './Promotions';
import { PromotionsContext } from '../../contexts/PromotionsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

jest.mock('../../supabase', () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis()
}));

const mockPromotions = [
    {
        id: 1,
        titulo: 'Promoção de Manutenção',
        descricao: '50% de desconto na primeira manutenção',
        valor_original: 200.00,
        valor_promocional: 100.00,
        data_inicio: '2024-05-09T18:56:00.000Z',
        data_fim: '2024-05-15T18:56:00.000Z',
        perfil: {
            nome_completo: 'Profissional A',
            foto_perfil_url: 'https://example.com/profissional-a.jpg',
            especialidade: 'Manicure'
        }
    }
];

describe('Promotions Integration Tests', () => {
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
        supabase.gte.mockReturnValue(supabase);
        supabase.order.mockReturnValue(supabase);
    });

    it('should fetch promotions on mount', async () => {
        supabase.select.mockResolvedValue({ data: mockPromotions });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Promotions />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('promocoes');
            expect(supabase.select).toHaveBeenCalledWith(`
                *,
                perfil:perfil_id (
                    nome_completo,
                    foto_perfil_url,
                    especialidade
                )
            `);
            expect(supabase.gte).toHaveBeenCalledWith('data_inicio', expect.any(String));
            expect(supabase.order).toHaveBeenCalledWith('data_inicio', { ascending: true });
        });

        expect(screen.getByText('Promoção de Manutenção')).toBeInTheDocument();
        expect(screen.getByText('50% de desconto na primeira manutenção')).toBeInTheDocument();
    });

    it('should add new promotion', async () => {
        supabase.select.mockResolvedValue({ data: mockPromotions });
        supabase.insert.mockResolvedValue({ error: null });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Promotions />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('promocoes');
        });

        const addPromotionButton = screen.getByText('Adicionar Promoção');
        fireEvent.click(addPromotionButton);

        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Nova Promoção' } });

        const saveButton = screen.getByText('Salvar');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(supabase.insert).toHaveBeenCalledWith({
                titulo: 'Nova Promoção',
                data_criacao: expect.any(String)
            });
        });
    });

    it('should handle API errors gracefully', async () => {
        supabase.select.mockResolvedValue({ error: new Error('API Error') });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Promotions />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar promoções')).toBeInTheDocument();
        });
    });

    it('should show loading state while fetching', async () => {
        supabase.select.mockResolvedValue({ data: mockPromotions });

        const { container } = render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Promotions />
            </AuthContext.Provider>
        );

        expect(screen.getByText('Carregando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Promoção de Manutenção')).toBeInTheDocument();
        });
    });
});
