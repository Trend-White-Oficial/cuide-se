import { useQuery } from '@tanstack/react-query';
import { Professional, Filter } from '../types';
import { useAuth } from './useAuth';

export function useProfessionals(filter?: Filter) {
  const { token } = useAuth();

  const buildQueryString = (filter?: Filter) => {
    if (!filter) return '';

    const params = new URLSearchParams();

    if (filter.specialty) {
      params.append('specialty', filter.specialty);
    }
    if (filter.location) {
      params.append('location', filter.location);
    }
    if (filter.priceRange) {
      params.append('minPrice', filter.priceRange.min.toString());
      params.append('maxPrice', filter.priceRange.max.toString());
    }
    if (filter.rating) {
      params.append('rating', filter.rating.toString());
    }
    if (filter.availability) {
      params.append('date', filter.availability.date);
      params.append('time', filter.availability.time);
    }

    return `?${params.toString()}`;
  };

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['professionals', filter],
    queryFn: async () => {
      const queryString = buildQueryString(filter);
      const response = await fetch(`https://api.cuide-se.com/professionals${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar profissionais');
      }

      return response.json();
    },
  });

  const getProfessionalById = (id: string): Professional | undefined => {
    return professionals?.find(professional => professional.id === id);
  };

  const getProfessionalsBySpecialty = (specialty: string): Professional[] => {
    return professionals?.filter(professional => professional.specialty === specialty) || [];
  };

  const getProfessionalsByLocation = (location: string): Professional[] => {
    return professionals?.filter(professional => 
      professional.location.toLowerCase().includes(location.toLowerCase())
    ) || [];
  };

  const getProfessionalsByRating = (minRating: number): Professional[] => {
    return professionals?.filter(professional => professional.rating >= minRating) || [];
  };

  const sortProfessionalsByRating = (ascending: boolean = false): Professional[] => {
    return [...(professionals || [])].sort((a, b) => 
      ascending ? a.rating - b.rating : b.rating - a.rating
    );
  };

  const sortProfessionalsByPrice = (ascending: boolean = true): Professional[] => {
    return [...(professionals || [])].sort((a, b) => {
      const aMinPrice = Math.min(...a.services.map(s => s.price));
      const bMinPrice = Math.min(...b.services.map(s => s.price));
      return ascending ? aMinPrice - bMinPrice : bMinPrice - aMinPrice;
    });
  };

  return {
    professionals,
    isLoading,
    getProfessionalById,
    getProfessionalsBySpecialty,
    getProfessionalsByLocation,
    getProfessionalsByRating,
    sortProfessionalsByRating,
    sortProfessionalsByPrice,
  };
} 