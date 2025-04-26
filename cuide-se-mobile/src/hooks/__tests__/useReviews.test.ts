import { renderHook, act } from '@testing-library/react';
import { useReviews } from '../useReviews';
import { reviewsService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do reviewsService
vi.mock('@/services/api', () => ({
  reviewsService: {
    getAll: vi.fn(),
    getByProfessionalId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.reviews).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar avaliações com sucesso', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Excelente serviço' },
      { id: 2, rating: 4, comment: 'Bom atendimento' },
    ];
    (reviewsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockReviews,
    });

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchReviews();
    });

    expect(result.current.reviews).toEqual(mockReviews);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao buscar avaliações', async () => {
    const errorMessage = 'Erro ao buscar avaliações';
    (reviewsService.getAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchReviews();
    });

    expect(result.current.reviews).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve buscar avaliações por profissional com sucesso', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Excelente serviço' },
      { id: 2, rating: 4, comment: 'Bom atendimento' },
    ];
    (reviewsService.getByProfessionalId as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockReviews,
    });

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchReviewsByProfessional(1);
    });

    expect(result.current.reviews).toEqual(mockReviews);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve criar uma avaliação com sucesso', async () => {
    const mockReview = { id: 1, rating: 5, comment: 'Excelente serviço' };
    (reviewsService.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockReview,
    });

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.createReview({
        professionalId: 1,
        rating: 5,
        comment: 'Excelente serviço',
      });
    });

    expect(result.current.reviews).toContainEqual(mockReview);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve atualizar uma avaliação com sucesso', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Excelente serviço' },
      { id: 2, rating: 4, comment: 'Bom atendimento' },
    ];
    (reviewsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockReviews,
    });
    (reviewsService.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { ...mockReviews[0], rating: 4, comment: 'Serviço bom' },
    });

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchReviews();
      await result.current.updateReview(1, {
        rating: 4,
        comment: 'Serviço bom',
      });
    });

    expect(result.current.reviews.find(r => r.id === 1)?.rating).toBe(4);
    expect(result.current.reviews.find(r => r.id === 1)?.comment).toBe('Serviço bom');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve excluir uma avaliação com sucesso', async () => {
    const mockReviews = [
      { id: 1, rating: 5, comment: 'Excelente serviço' },
      { id: 2, rating: 4, comment: 'Bom atendimento' },
    ];
    (reviewsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockReviews,
    });
    (reviewsService.delete as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchReviews();
      await result.current.deleteReview(1);
    });

    expect(result.current.reviews.find(r => r.id === 1)).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useReviews(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 