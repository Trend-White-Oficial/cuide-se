import { useQuery } from '@tanstack/react-query';
import { professionalService } from '@/services/api';
import type { Professional } from '@/types/api';

interface UseProfessionalsOptions {
  specialty?: string;
  city?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

interface UseProfessionalsResult {
  professionals: Professional[];
  isLoading: boolean;
  error: Error | null;
  total: number;
  page: number;
  totalPages: number;
}

export function useProfessionals(options?: UseProfessionalsOptions): UseProfessionalsResult {
  const {
    data: professionalsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['professionals', options],
    queryFn: () => professionalService.getAll(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const professionals = professionalsData?.data?.data ?? [];
  const total = professionals.length;
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;

  // Filtragem local
  const filteredProfessionals = professionals.filter(professional => {
    if (options?.specialty && !professional.specialties.includes(options.specialty)) {
      return false;
    }
    if (options?.city && professional.address.city !== options.city) {
      return false;
    }
    if (options?.rating && professional.rating < options.rating) {
      return false;
    }
    return true;
  });

  // Paginação local
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProfessionals = filteredProfessionals.slice(start, end);

  return {
    professionals: paginatedProfessionals,
    isLoading,
    error: error as Error | null,
    total: filteredProfessionals.length,
    page,
    totalPages: Math.ceil(filteredProfessionals.length / limit)
  };
}

export function useProfessionalDetails(id: string) {
  return useQuery({
    queryKey: ['professional', id],
    queryFn: () => professionalService.getById(id),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

export function useProfessionalServices(id: string) {
  return useQuery({
    queryKey: ['professional-services', id],
    queryFn: () => professionalService.getServices(id),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}

export function useProfessionalReviews(id: string) {
  return useQuery({
    queryKey: ['professional-reviews', id],
    queryFn: () => professionalService.getReviews(id),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
} 