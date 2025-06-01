import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { useStorage } from './useStorage';

interface Professional {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface ProfessionalState {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
}

interface CreateProfessionalData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  experience_years: number;
  avatar_url?: string;
}

export const useProfessionals = () => {
  const [state, setState] = useState<ProfessionalState>({
    professionals: [],
    loading: false,
    error: null,
  });

  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const { getItem, setItem } = useStorage();

  // Carrega todos os profissionais
  const loadProfessionals = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Tenta carregar do cache primeiro
      const cachedProfessionals = await getItem('@CuideSe:professionals');
      if (cachedProfessionals) {
        setState(prev => ({
          ...prev,
          professionals: cachedProfessionals as Professional[],
          loading: false,
        }));
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        professionals: data as Professional[],
        loading: false,
      }));

      // Salva no cache
      await setItem('@CuideSe:professionals', data);

      // Registra o evento
      await logEvent('professionals_loaded', {
        count: data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar profissionais'));
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao carregar profissionais'),
        loading: false,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao carregar profissionais',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [getItem, setItem, logEvent, showToast, recordError]);

  // Cria um novo profissional
  const createProfessional = useCallback(
    async (data: CreateProfessionalData): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data: professional, error } = await supabase
          .from('professionals')
          .insert([{ ...data, is_available: true, rating: 0, total_reviews: 0 }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          professionals: [...prev.professionals, professional as Professional],
          loading: false,
        }));

        // Atualiza o cache
        const updatedProfessionals = [...state.professionals, professional as Professional];
        await setItem('@CuideSe:professionals', updatedProfessionals);

        // Registra o evento
        await logEvent('professional_created', {
          professional_id: professional.id,
          name: data.name,
          specialties: data.specialties,
        });

        showToast({
          type: 'success',
          message: 'Profissional criado',
          description: 'O profissional foi criado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao criar profissional:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao criar profissional'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao criar profissional'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao criar profissional',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [state.professionals, setItem, logEvent, showToast, recordError]
  );

  // Atualiza um profissional
  const updateProfessional = useCallback(
    async (id: string, updates: Partial<Professional>): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('professionals')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          professionals: prev.professionals.map(professional =>
            professional.id === id ? (data as Professional) : professional
          ),
          loading: false,
        }));

        // Atualiza o cache
        const updatedProfessionals = state.professionals.map(professional =>
          professional.id === id ? (data as Professional) : professional
        );
        await setItem('@CuideSe:professionals', updatedProfessionals);

        // Registra o evento
        await logEvent('professional_updated', {
          professional_id: id,
          updates: Object.keys(updates),
        });

        showToast({
          type: 'success',
          message: 'Profissional atualizado',
          description: 'O profissional foi atualizado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar profissional:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar profissional'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar profissional'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar profissional',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [state.professionals, setItem, logEvent, showToast, recordError]
  );

  // Atualiza a disponibilidade do profissional
  const updateAvailability = useCallback(
    async (id: string, isAvailable: boolean): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { error } = await supabase
          .from('professionals')
          .update({ is_available: isAvailable })
          .eq('id', id);

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          professionals: prev.professionals.map(professional =>
            professional.id === id
              ? { ...professional, is_available: isAvailable }
              : professional
          ),
          loading: false,
        }));

        // Atualiza o cache
        const updatedProfessionals = state.professionals.map(professional =>
          professional.id === id
            ? { ...professional, is_available: isAvailable }
            : professional
        );
        await setItem('@CuideSe:professionals', updatedProfessionals);

        // Registra o evento
        await logEvent('professional_availability_updated', {
          professional_id: id,
          is_available: isAvailable,
        });

        showToast({
          type: 'success',
          message: 'Disponibilidade atualizada',
          description: `O profissional está ${isAvailable ? 'disponível' : 'indisponível'}`,
        });
      } catch (error) {
        console.error('Erro ao atualizar disponibilidade:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar disponibilidade'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar disponibilidade'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar disponibilidade',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [state.professionals, setItem, logEvent, showToast, recordError]
  );

  // Filtra profissionais por especialidade
  const filterProfessionalsBySpecialty = useCallback(
    (specialty: string): Professional[] => {
      return state.professionals.filter(professional =>
        professional.specialties.includes(specialty)
      );
    },
    [state.professionals]
  );

  // Filtra profissionais por experiência
  const filterProfessionalsByExperience = useCallback(
    (minYears: number): Professional[] => {
      return state.professionals.filter(
        professional => professional.experience_years >= minYears
      );
    },
    [state.professionals]
  );

  // Filtra profissionais por avaliação
  const filterProfessionalsByRating = useCallback(
    (minRating: number): Professional[] => {
      return state.professionals.filter(
        professional => professional.rating >= minRating
      );
    },
    [state.professionals]
  );

  // Busca profissionais por texto
  const searchProfessionals = useCallback(
    (query: string): Professional[] => {
      const normalizedQuery = query.toLowerCase();
      return state.professionals.filter(
        professional =>
          professional.name.toLowerCase().includes(normalizedQuery) ||
          professional.bio.toLowerCase().includes(normalizedQuery) ||
          professional.specialties.some(specialty =>
            specialty.toLowerCase().includes(normalizedQuery)
          )
      );
    },
    [state.professionals]
  );

  return {
    ...state,
    loadProfessionals,
    createProfessional,
    updateProfessional,
    updateAvailability,
    filterProfessionalsBySpecialty,
    filterProfessionalsByExperience,
    filterProfessionalsByRating,
    searchProfessionals,
  };
}; 