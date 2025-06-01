import { supabase } from './supabase';

export interface Review {
  id: string;
  userId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  serviceId: string;
  rating: number;
  comment: string;
}

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: review, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            service_id: data.serviceId,
            rating: data.rating,
            comment: data.comment,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapReview(review);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  }

  async getReviewById(id: string): Promise<Review> {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.mapReview(review);
    } catch (error) {
      console.error('Erro ao obter avaliação:', error);
      throw error;
    }
  }

  async getReviews(): Promise<Review[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return reviews.map(this.mapReview);
    } catch (error) {
      console.error('Erro ao obter avaliações:', error);
      throw error;
    }
  }

  async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return reviews.map(this.mapReview);
    } catch (error) {
      console.error('Erro ao obter avaliações do serviço:', error);
      throw error;
    }
  }

  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<Review> {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapReview(review);
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      throw error;
    }
  }

  private mapReview(review: any): Review {
    return {
      id: review.id,
      userId: review.user_id,
      serviceId: review.service_id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    };
  }
}

export const reviewService = new ReviewService(); 