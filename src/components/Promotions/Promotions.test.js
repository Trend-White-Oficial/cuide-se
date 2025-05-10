import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Promotions from './Promotions';
import { PromotionsContext } from '../../contexts/PromotionsContext';
import { AuthContext } from '../../contexts/AuthContext';

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
    },
    {
        id: 2,
        titulo: 'Combo de Cabelo',
        descricao: 'Corte + Escova + Hidratação',
        valor_original: 300.00,
        valor_promocional: 250.00,
        data_inicio: '2024-05-10T18:56:00.000Z',
        data_fim: '2024-05-20T18:56:00.000Z',
        perfil: {
            nome_completo: 'Profissional B',
            foto_perfil_url: 'https://example.com/profissional-b.jpg',
            especialidade: 'Cabeleireiro'
        }
    }
];

describe('Promotions Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        promotions: mockPromotions,
        loading: false,
        fetchPromotions: jest.fn(),
        addPromotion: jest.fn(),
        updatePromotion: jest.fn(),
        deletePromotion: jest.fn()
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
