import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Promotions } from './Promotions';
import { PromotionsContext } from '../../contexts/PromotionsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockPromotions = [
    {
        id: 1,
        title: 'Promoção 1',
        description: 'Descrição da promoção 1',
        discount: 10,
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    },
    {
        id: 2,
        title: 'Promoção 2',
        description: 'Descrição da promoção 2',
        discount: 20,
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    }
];

const mockPromotionsService = {
    fetchPromotions: vi.fn(),
    addPromotion: vi.fn(),
    updatePromotion: vi.fn(),
    deletePromotion: vi.fn()
};

describe('Promotions Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        promotions: mockPromotions,
        loading: false,
        fetchPromotions: mockPromotionsService.fetchPromotions,
        addPromotion: mockPromotionsService.addPromotion,
        updatePromotion: mockPromotionsService.updatePromotion,
        deletePromotion: mockPromotionsService.deletePromotion
    };

    const mockAuthContext = {
        user: mockUser
    };

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                <PromotionsContext.Provider value={mockContext}>
                    <Promotions />
                </PromotionsContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('should render promotions list', () => {
        renderComponent();
        
        expect(screen.getByText('Promoção de Manutenção')).toBeInTheDocument();
        expect(screen.getByText('Combo de Cabelo')).toBeInTheDocument();
    });

    it('should show correct promotion prices', () => {
        renderComponent();
        
        expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
        expect(screen.getByText('R$ 250,00')).toBeInTheDocument();
    });

    it('should show promotion validity dates', () => {
        renderComponent();
        
        expect(screen.getByText('09/05/2024 - 15/05/2024')).toBeInTheDocument();
        expect(screen.getByText('10/05/2024 - 20/05/2024')).toBeInTheDocument();
    });

    it('should call addPromotion when new promotion is created', async () => {
        renderComponent();
        
        const addPromotionButton = screen.getByText('Adicionar Promoção');
        fireEvent.click(addPromotionButton);
        
        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Nova Promoção' } });

        const valorOriginalInput = screen.getByLabelText('Valor Original');
        fireEvent.change(valorOriginalInput, { target: { value: '300.00' } });

        const valorPromocionalInput = screen.getByLabelText('Valor Promocional');
        fireEvent.change(valorPromocionalInput, { target: { value: '250.00' } });

        const saveButton = screen.getByText('Salvar');
        fireEvent.click(saveButton);
        
        await waitFor(() => {
            expect(mockContext.addPromotion).toHaveBeenCalledWith({
                titulo: 'Nova Promoção',
                valor_original: 300.00,
                valor_promocional: 250.00,
                data_inicio: expect.any(String),
                data_fim: expect.any(String)
            });
        });
    });

    it('should show loading state', () => {
        const loadingContext = { ...mockContext, loading: true };
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <PromotionsContext.Provider value={loadingContext}>
                    <Promotions />
                </PromotionsContext.Provider>
            </AuthContext.Provider>
        );
        
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
});
