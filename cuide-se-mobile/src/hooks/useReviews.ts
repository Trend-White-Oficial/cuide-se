import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { useStorage } from './useStorage';

interface Review {
  id: string;
  user_id: string;
  professional_id: string;
  appointment_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: Error | null;
}

interface CreateReviewData {
  professional_id: string;
  appointment_id: string;
  rating: number;
  comment: string;
}

export const useReviews = () => {
  const [state, setState] = useState<ReviewState>({
    reviews: [],
    loading: false,
    error: null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const { getItem, setItem } = useStorage();

  // Carrega as avaliações de um profissional
  const loadProfessionalReviews = useCallback(
    async (professionalId: string): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Tenta carregar do cache primeiro
        const cacheKey = `@CuideSe:reviews:${professionalId}`;
        const cachedReviews = await getItem(cacheKey);
        if (cachedReviews) {
          setState(prev => ({
            ...prev,
            reviews: cachedReviews as Review[],
            loading: false,
          }));
        }

        const { data, error } = await supabase
          .from('reviews')
          .select('*, users(name, avatar_url)')
          .eq('professional_id', professionalId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedReviews = data.map(review => ({
          ...review,
          user_name: review.users.name,
          user_avatar: review.users.avatar_url,
        }));

        setState(prev => ({
          ...prev,
          reviews: formattedReviews as Review[],
          loading: false,
        }));

        // Salva no cache
        await setItem(cacheKey, formattedReviews);

        // Registra o evento
        await logEvent('professional_reviews_loaded', {
          professional_id: professionalId,
          count: data.length,
        });
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao carregar avaliações'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao carregar avaliações'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao carregar avaliações',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [getItem, setItem, logEvent, showToast, recordError]
  );

  // Cria uma nova avaliação
  const createReview = useCallback(
    async (data: CreateReviewData): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data: review, error } = await supabase
          .from('reviews')
          .insert([
            {
              user_id: user.id,
              ...data,
            },
          ])
          .select('*, users(name, avatar_url)')
          .single();

        if (error) {
          throw error;
        }

        const formattedReview = {
          ...review,
          user_name: review.users.name,
          user_avatar: review.users.avatar_url,
        };

        setState(prev => ({
          ...prev,
          reviews: [formattedReview as Review, ...prev.reviews],
          loading: false,
        }));

        // Atualiza o cache
        const cacheKey = `@CuideSe:reviews:${data.professional_id}`;
        const updatedReviews = [formattedReview as Review, ...state.reviews];
        await setItem(cacheKey, updatedReviews);

        // Atualiza a média de avaliações do profissional
        const { data: professionalReviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('professional_id', data.professional_id);

        if (professionalReviews) {
          const totalRating = professionalReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / professionalReviews.length;

          await supabase
            .from('professionals')
            .update({
              rating: averageRating,
              total_reviews: professionalReviews.length,
            })
            .eq('id', data.professional_id);
        }

        // Registra o evento
        await logEvent('review_created', {
          user_id: user.id,
          professional_id: data.professional_id,
          appointment_id: data.appointment_id,
          rating: data.rating,
        });

        showToast({
          type: 'success',
          message: 'Avaliação enviada',
          description: 'Sua avaliação foi registrada com sucesso',
        });
      } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao criar avaliação'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao criar avaliação'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao criar avaliação',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.reviews, setItem, logEvent, showToast, recordError]
  );

  // Atualiza uma avaliação
  const updateReview = useCallback(
    async (id: string, updates: Partial<Review>): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('reviews')
          .update(updates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select('*, users(name, avatar_url)')
          .single();

        if (error) {
          throw error;
        }

        const formattedReview = {
          ...data,
          user_name: data.users.name,
          user_avatar: data.users.avatar_url,
        };

        setState(prev => ({
          ...prev,
          reviews: prev.reviews.map(review =>
            review.id === id ? (formattedReview as Review) : review
          ),
          loading: false,
        }));

        // Atualiza o cache
        const cacheKey = `@CuideSe:reviews:${formattedReview.professional_id}`;
        const updatedReviews = state.reviews.map(review =>
          review.id === id ? (formattedReview as Review) : review
        );
        await setItem(cacheKey, updatedReviews);

        // Atualiza a média de avaliações do profissional
        const { data: professionalReviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('professional_id', formattedReview.professional_id);

        if (professionalReviews) {
          const totalRating = professionalReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / professionalReviews.length;

          await supabase
            .from('professionals')
            .update({
              rating: averageRating,
              total_reviews: professionalReviews.length,
            })
            .eq('id', formattedReview.professional_id);
        }

        // Registra o evento
        await logEvent('review_updated', {
          user_id: user.id,
          review_id: id,
          updates: Object.keys(updates),
        });

        showToast({
          type: 'success',
          message: 'Avaliação atualizada',
          description: 'Sua avaliação foi atualizada com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar avaliação'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar avaliação'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar avaliação',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.reviews, setItem, logEvent, showToast, recordError]
  );

  // Remove uma avaliação
  const removeReview = useCallback(
    async (id: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const reviewToRemove = state.reviews.find(review => review.id === id);
        if (!reviewToRemove) return;

        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          reviews: prev.reviews.filter(review => review.id !== id),
          loading: false,
        }));

        // Atualiza o cache
        const cacheKey = `@CuideSe:reviews:${reviewToRemove.professional_id}`;
        const updatedReviews = state.reviews.filter(review => review.id !== id);
        await setItem(cacheKey, updatedReviews);

        // Atualiza a média de avaliações do profissional
        const { data: professionalReviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('professional_id', reviewToRemove.professional_id);

        if (professionalReviews) {
          const totalRating = professionalReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const averageRating = totalRating / professionalReviews.length;

          await supabase
            .from('professionals')
            .update({
              rating: averageRating,
              total_reviews: professionalReviews.length,
            })
            .eq('id', reviewToRemove.professional_id);
        }

        // Registra o evento
        await logEvent('review_removed', {
          user_id: user.id,
          review_id: id,
          professional_id: reviewToRemove.professional_id,
        });

        showToast({
          type: 'success',
          message: 'Avaliação removida',
          description: 'Sua avaliação foi removida com sucesso',
        });
      } catch (error) {
        console.error('Erro ao remover avaliação:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao remover avaliação'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao remover avaliação'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao remover avaliação',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.reviews, setItem, logEvent, showToast, recordError]
  );

  // Filtra avaliações por nota
  const filterReviewsByRating = useCallback(
    (rating: number): Review[] => {
      return state.reviews.filter(review => review.rating === rating);
    },
    [state.reviews]
  );

  // Calcula a média de avaliações
  const calculateAverageRating = useCallback((): number => {
    if (state.reviews.length === 0) return 0;
    const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / state.reviews.length;
  }, [state.reviews]);

  // Conta avaliações por nota
  const countReviewsByRating = useCallback(
    (rating: number): number => {
      return state.reviews.filter(review => review.rating === rating).length;
    },
    [state.reviews]
  );

  return {
    ...state,
    loadProfessionalReviews,
    createReview,
    updateReview,
    removeReview,
    filterReviewsByRating,
    calculateAverageRating,
    countReviewsByRating,
  };
}; 