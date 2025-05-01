import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/api';
import type { Scheduling } from '@/types/api';

export const useScheduling = () => {
  const queryClient = useQueryClient();

  const {
    data: userSchedulingData,
    isLoading: isLoadingUserScheduling,
    error: userSchedulingError,
  } = useQuery({
    queryKey: ['user-scheduling'],
    queryFn: () => schedulingService.getByUser(),
  });

  const {
    data: professionalSchedulingData,
    isLoading: isLoadingProfessionalScheduling,
    error: professionalSchedulingError,
  } = useQuery({
    queryKey: ['professional-scheduling'],
    queryFn: () => schedulingService.getByProfessional(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Scheduling, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'professional' | 'service'>) =>
      schedulingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-scheduling'] });
      queryClient.invalidateQueries({ queryKey: ['professional-scheduling'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => schedulingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-scheduling'] });
      queryClient.invalidateQueries({ queryKey: ['professional-scheduling'] });
    },
  });

  return {
    userScheduling: userSchedulingData?.data?.data ?? [],
    professionalScheduling: professionalSchedulingData?.data?.data ?? [],
    isLoadingUserScheduling,
    isLoadingProfessionalScheduling,
    userSchedulingError,
    professionalSchedulingError,
    createScheduling: createMutation.mutate,
    cancelScheduling: cancelMutation.mutate,
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
}; 