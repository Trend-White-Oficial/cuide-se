import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do supabase
vi.mock('../services/supabaseService', () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        rpc: vi.fn().mockReturnThis()
    }
}));

// Mock do toast
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

// Componente de teste para usar o hook
function TestComponent() {
    const cart = useCart();
    return (
        <div>
            <div data-testid="loading">{cart.loading ? 'loading' : 'not loading'}</div>
            <div data-testid="items">{JSON.stringify(cart.items)}</div>
            <button onClick={() => cart.fetchCart()}>Fetch Cart</button>
            <button onClick={() => cart.addToCart({ servicoId: '1', profissionalId: '1' })}>Add to Cart</button>
            <button onClick={() => cart.removeFromCart('1')}>Remove from Cart</button>
            <button onClick={() => cart.clearCart()}>Clear Cart</button>
            <button onClick={() => cart.checkout()}>Checkout</button>
        </div>
    );
}

describe('CartContext', () => {
    const mockUser = { id: 'user-id' };
    const mockItem = {
        servicoId: 'service-id',
        profissionalId: 'professional-id'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve buscar itens do carrinho corretamente', async () => {
        const mockData = [{
            id: 'cart-item-1',
            servico: {
                id: 'service-id',
                nome: 'Serviço Teste',
                preco: 100,
                duracao: 60
            },
            profissional: {
                id: 'professional-id',
                nome_completo: 'Profissional Teste',
                foto_perfil_url: 'https://test.com/profile.jpg'
            }
        }];

        supabase.select.mockResolvedValue({ data: mockData, error: null });

        render(
            <AuthProvider value={{ user: mockUser }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthProvider>
        );

        const fetchButton = screen.getByText('Fetch Cart');
        await act(async () => {
            fetchButton.click();
        });

        expect(screen.getByTestId('items').textContent).toBe(JSON.stringify(mockData));
        expect(screen.getByTestId('loading').textContent).toBe('not loading');
        expect(supabase.from).toHaveBeenCalledWith('carrinho');
    });

    it('deve adicionar item ao carrinho corretamente', async () => {
        supabase.insert.mockResolvedValue({ error: null });

        render(
            <AuthProvider value={{ user: mockUser }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthProvider>
        );

        const addButton = screen.getByText('Add to Cart');
        await act(async () => {
            addButton.click();
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.insert).toHaveBeenCalledWith({
            usuario_id: mockUser.id,
            servico_id: '1',
            profissional_id: '1'
        });
    });

    it('deve remover item do carrinho corretamente', async () => {
        supabase.delete.mockResolvedValue({ error: null });

        render(
            <AuthProvider value={{ user: mockUser }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthProvider>
        );

        const removeButton = screen.getByText('Remove from Cart');
        await act(async () => {
            removeButton.click();
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.delete).toHaveBeenCalledWith();
    });

    it('deve limpar o carrinho corretamente', async () => {
        supabase.delete.mockResolvedValue({ error: null });

        render(
            <AuthProvider value={{ user: mockUser }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthProvider>
        );

        const clearButton = screen.getByText('Clear Cart');
        await act(async () => {
            clearButton.click();
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.delete).toHaveBeenCalledWith();
    });

    it('deve finalizar o agendamento corretamente', async () => {
        supabase.insert.mockResolvedValue({ error: null });
        supabase.rpc.mockResolvedValue({ error: null });

        render(
            <AuthProvider value={{ user: mockUser }}>
                <CartProvider>
                    <TestComponent />
                </CartProvider>
            </AuthProvider>
        );

        const checkoutButton = screen.getByText('Checkout');
        await act(async () => {
            checkoutButton.click();
        });

        expect(supabase.from).toHaveBeenCalledWith('agendamentos');
        expect(supabase.insert).toHaveBeenCalled();
    });
});
