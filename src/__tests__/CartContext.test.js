import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { CartProvider, useCart } from '../contexts/CartContext';
import { AuthProvider } from '../auth/AuthContext';
import { supabase } from '../supabase';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do supabase
vi.mock('../supabase', () => ({
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    rpc: jest.fn().mockReturnThis()
}));

// Mock do toast
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}));

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

        supabase.from.mockResolvedValue({ data: mockData, error: null });

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider value={{ user: mockUser }}>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            )
        });

        await act(async () => {
            await result.current.fetchCart();
        });

        expect(result.current.items).toEqual(mockData);
        expect(result.current.loading).toBe(false);
        expect(supabase.from).toHaveBeenCalledWith('carrinho');
    });

    it('deve adicionar item ao carrinho corretamente', async () => {
        supabase.from.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider value={{ user: mockUser }}>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            )
        });

        await act(async () => {
            await result.current.addToCart(mockItem);
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.insert).toHaveBeenCalledWith({
            usuario_id: mockUser.id,
            servico_id: mockItem.servicoId,
            profissional_id: mockItem.profissionalId
        });
    });

    it('deve remover item do carrinho corretamente', async () => {
        supabase.from.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider value={{ user: mockUser }}>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            )
        });

        await act(async () => {
            await result.current.removeFromCart('cart-item-1');
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.delete).toHaveBeenCalledWith();
    });

    it('deve limpar o carrinho corretamente', async () => {
        supabase.from.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider value={{ user: mockUser }}>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            )
        });

        await act(async () => {
            await result.current.clearCart();
        });

        expect(supabase.from).toHaveBeenCalledWith('carrinho');
        expect(supabase.delete).toHaveBeenCalledWith();
    });

    it('deve finalizar o agendamento corretamente', async () => {
        supabase.from.mockResolvedValue({ error: null });
        supabase.rpc.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => (
                <AuthProvider value={{ user: mockUser }}>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            )
        });

        await act(async () => {
            await result.current.checkout();
        });

        expect(supabase.from).toHaveBeenCalledWith('agendamentos');
        expect(supabase.insert).toHaveBeenCalled();
    });
});
