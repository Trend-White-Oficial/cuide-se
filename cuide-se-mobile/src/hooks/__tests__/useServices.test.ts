import { renderHook, act } from '@testing-library/react';
import { useServices } from '../useServices';
import { servicesService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do servicesService
vi.mock('@/services/api', () => ({
  servicesService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByProfessionalId: vi.fn(),
  },
}));

describe('useServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.services).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar serviços com sucesso', async () => {
    const mockServices = [
      { id: 1, name: 'Corte de Cabelo', price: 50 },
      { id: 2, name: 'Manicure', price: 30 },
    ];
    (servicesService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockServices,
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchServices();
    });

    expect(result.current.services).toEqual(mockServices);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao buscar serviços', async () => {
    const errorMessage = 'Erro ao buscar serviços';
    (servicesService.getAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchServices();
    });

    expect(result.current.services).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve buscar um serviço por ID com sucesso', async () => {
    const mockService = { id: 1, name: 'Corte de Cabelo', price: 50 };
    (servicesService.getById as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockService,
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchServiceById(1);
    });

    expect(result.current.selectedService).toEqual(mockService);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar serviços por profissional com sucesso', async () => {
    const mockServices = [
      { id: 1, name: 'Corte de Cabelo', price: 50 },
      { id: 2, name: 'Manicure', price: 30 },
    ];
    (servicesService.getByProfessionalId as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockServices,
    });

    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchServicesByProfessional(1);
    });

    expect(result.current.services).toEqual(mockServices);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useServices(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 