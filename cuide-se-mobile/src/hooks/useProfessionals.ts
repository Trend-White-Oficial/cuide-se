import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  bio?: string;
  specialties: string[];
  rating: number;
  created_at: string;
  updated_at: string;
}

interface CreateProfessionalData {
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  bio?: string;
  specialties: string[];
}

interface UpdateProfessionalData {
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  specialties?: string[];
}

export const useProfessionals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Busca todos os profissionais
  const getProfessionals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Professional[];
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca um profissional específico
  const getProfessional = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'professional')
        .single();

      if (error) {
        throw error;
      }

      return data as Professional;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca profissionais por especialidade
  const getProfessionalsBySpecialty = useCallback(async (specialty: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional')
        .contains('specialties', [specialty])
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Professional[];
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca profissionais por nome
  const searchProfessionals = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional')
        .ilike('name', `%${searchTerm}%`)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Professional[];
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cria um novo profissional
  const createProfessional = useCallback(async (data: CreateProfessionalData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: professional, error } = await supabase
        .from('profiles')
        .insert([
          {
            ...data,
            role: 'professional',
            rating: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return professional as Professional;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza um profissional existente
  const updateProfessional = useCallback(async (id: string, data: UpdateProfessionalData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: professional, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', id)
        .eq('role', 'professional')
        .select()
        .single();

      if (error) {
        throw error;
      }

      return professional as Professional;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove um profissional
  const deleteProfessional = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .eq('role', 'professional');

      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza a avaliação de um profissional
  const updateProfessionalRating = useCallback(async (id: string, rating: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data: professional, error } = await supabase
        .from('profiles')
        .update({ rating })
        .eq('id', id)
        .eq('role', 'professional')
        .select()
        .single();

      if (error) {
        throw error;
      }

      return professional as Professional;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProfessionals,
    getProfessional,
    getProfessionalsBySpecialty,
    searchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    updateProfessionalRating,
  };
}; 