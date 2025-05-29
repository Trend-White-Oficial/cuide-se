import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/api';
import type { Review } from '@/types/api';
import { useAuth } from './useAuth';

export const useReviews = (professionalId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: professionalReviewsData,
    isLoading: isLoadingProfessionalReviews,
    error: professionalReviewsError,
  } = useQuery({
    queryKey: ['professional-reviews', professionalId],
    queryFn: () => professionalId ? reviewService.getByProfessional(professionalId) : null,
    enabled: !!professionalId,
  });

  const {
    data: userReviewsData,
    isLoading: isLoadingUserReviews,
    error: userReviewsError,
  } = useQuery({
    queryKey: ['user-reviews'],
    queryFn: () => user ? reviewService.getByUser(user.id) : null,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'user'>) =>
      reviewService.create(data),
    onSuccess: () => {
      if (professionalId) {
        queryClient.invalidateQueries({ queryKey: ['professional-reviews', professionalId] });
      }
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
  });

  return {
    professionalReviews: professionalReviewsData?.data?.data ?? [],
    userReviews: userReviewsData?.data?.data ?? [],
    isLoadingProfessionalReviews,
    isLoadingUserReviews,
    professionalReviewsError,
    userReviewsError,
    createReview: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}; 