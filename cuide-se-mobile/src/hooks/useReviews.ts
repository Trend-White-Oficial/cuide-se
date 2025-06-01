import { useState, useCallback, useEffect } from 'react';
import { reviewService, Review, CreateReviewData } from '../services/reviews';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reviewService.getReviews();
      setReviews(data);
      await logEvent('reviews_loaded', {
        user_id: user?.id,
        count: data.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
      recordError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
      showToast({
        type: 'error',
        message: 'Erro ao carregar avaliações',
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const createReview = useCallback(async (data: CreateReviewData) => {
    try {
      setIsLoading(true);
      setError(null);
      const review = await reviewService.createReview(data);
      setReviews(prev => [review, ...prev]);
      await logEvent('review_created', {
        user_id: user?.id,
        service_id: data.serviceId,
        rating: data.rating,
      });
      showToast({
        type: 'success',
        message: 'Avaliação enviada',
        description: 'Obrigado por avaliar nosso serviço!',
      });
      return review;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar avaliação'));
      recordError(err instanceof Error ? err : new Error('Erro ao criar avaliação'));
      showToast({
        type: 'error',
        message: 'Erro ao criar avaliação',
        description: 'Tente novamente mais tarde',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const getReviewById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const review = await reviewService.getReviewById(id);
      return review;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao obter avaliação'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getServiceReviews = useCallback(async (serviceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const reviews = await reviewService.getServiceReviews(serviceId);
      return reviews;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao obter avaliações do serviço'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReview = useCallback(async (id: string, data: Partial<CreateReviewData>) => {
    try {
      setIsLoading(true);
      setError(null);
      const review = await reviewService.updateReview(id, data);
      setReviews(prev =>
        prev.map(r => (r.id === id ? review : r))
      );
      await logEvent('review_updated', {
        user_id: user?.id,
        review_id: id,
        rating: data.rating,
      });
      showToast({
        type: 'success',
        message: 'Avaliação atualizada',
        description: 'Sua avaliação foi atualizada com sucesso',
      });
      return review;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar avaliação'));
      recordError(err instanceof Error ? err : new Error('Erro ao atualizar avaliação'));
      showToast({
        type: 'error',
        message: 'Erro ao atualizar avaliação',
        description: 'Tente novamente mais tarde',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  const deleteReview = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await reviewService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      await logEvent('review_deleted', {
        user_id: user?.id,
        review_id: id,
      });
      showToast({
        type: 'success',
        message: 'Avaliação excluída',
        description: 'Sua avaliação foi excluída com sucesso',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir avaliação'));
      recordError(err instanceof Error ? err : new Error('Erro ao excluir avaliação'));
      showToast({
        type: 'error',
        message: 'Erro ao excluir avaliação',
        description: 'Tente novamente mais tarde',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, logEvent, showToast, recordError]);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user, fetchReviews]);

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    createReview,
    getReviewById,
    getServiceReviews,
    updateReview,
    deleteReview,
  };
}; 