import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

interface Review {
  id: string;
  user_id: string;
  professional_id: string;
  appointment_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

interface CreateReviewData {
  professional_id: string;
  appointment_id: string;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export const useReviews = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Busca todas as avaliações de um profissional
  const getProfessionalReviews = useCallback(async (professionalId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!user_id(*)
        `)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as (Review & { user: { name: string; avatar_url?: string } })[];
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca todas as avaliações feitas pelo usuário
  const getUserReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          professional:profiles!professional_id(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as (Review & { professional: { name: string; avatar_url?: string } })[];
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Busca uma avaliação específica
  const getReview = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!user_id(*),
          professional:profiles!professional_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Review & {
        user: { name: string; avatar_url?: string };
        professional: { name: string; avatar_url?: string };
      };
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cria uma nova avaliação
  const createReview = useCallback(async (data: CreateReviewData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: review, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            ...data,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualiza a média de avaliações do profissional
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', data.professional_id);

      if (reviews) {
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await supabase
          .from('profiles')
          .update({ rating: averageRating })
          .eq('id', data.professional_id);
      }

      return review as Review;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Atualiza uma avaliação existente
  const updateReview = useCallback(async (id: string, data: UpdateReviewData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: review, error } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualiza a média de avaliações do profissional
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', review.professional_id);

      if (reviews) {
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await supabase
          .from('profiles')
          .update({ rating: averageRating })
          .eq('id', review.professional_id);
      }

      return review as Review;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Remove uma avaliação
  const deleteReview = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: review } = await supabase
        .from('reviews')
        .select('professional_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Atualiza a média de avaliações do profissional
      if (review) {
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('professional_id', review.professional_id);

        if (reviews && reviews.length > 0) {
          const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

          await supabase
            .from('profiles')
            .update({ rating: averageRating })
            .eq('id', review.professional_id);
        } else {
          await supabase
            .from('profiles')
            .update({ rating: 0 })
            .eq('id', review.professional_id);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    getProfessionalReviews,
    getUserReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
  };
}; 