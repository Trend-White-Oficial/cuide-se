import { renderHook, act } from '@testing-library/react';
import { useProfessionals } from '../useProfessionals';
import { professionalsService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do professionalsService
vi.mock('@/services/api', () => ({
  professionalsService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    search: vi.fn(),
  },
}));

describe('useProfessionals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.professionals).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar profissionais com sucesso', async () => {
    const mockProfessionals = [
      { id: 1, name: 'Profissional 1' },
      { id: 2, name: 'Profissional 2' },
    ];
    (professionalsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockProfessionals,
    });

    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchProfessionals();
    });

    expect(result.current.professionals).toEqual(mockProfessionals);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao buscar profissionais', async () => {
    const errorMessage = 'Erro ao buscar profissionais';
    (professionalsService.getAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchProfessionals();
    });

    expect(result.current.professionals).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve buscar um profissional por ID com sucesso', async () => {
    const mockProfessional = { id: 1, name: 'Profissional 1' };
    (professionalsService.getById as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockProfessional,
    });

    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchProfessionalById(1);
    });

    expect(result.current.selectedProfessional).toEqual(mockProfessional);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve pesquisar profissionais com sucesso', async () => {
    const mockProfessionals = [
      { id: 1, name: 'Profissional 1' },
      { id: 2, name: 'Profissional 2' },
    ];
    (professionalsService.search as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockProfessionals,
    });

    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.searchProfessionals('cabelo');
    });

    expect(result.current.professionals).toEqual(mockProfessionals);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useProfessionals(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 