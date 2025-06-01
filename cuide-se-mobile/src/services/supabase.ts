import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { API_CONFIG } from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'cuide-se-mobile',
    },
  },
});

// Tipos de dados
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  professional_id: string;
  service_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image_url?: string;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  specialties: string[];
  rating: number;
}

// Funções de API
export const api = {
  // Usuários
  users: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as User;
    },

    updateProfile: async (userId: string, updates: Partial<User>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as User;
    },
  },

  // Agendamentos
  appointments: {
    list: async (userId: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          professional:profiles(*),
          service:services(*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
    },

    create: async (appointment: Omit<Appointment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data as Appointment;
    },

    update: async (id: string, updates: Partial<Appointment>) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Appointment;
    },

    cancel: async (id: string) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Appointment;
    },
  },

  // Serviços
  services: {
    list: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Service[];
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Service;
    },
  },

  // Profissionais
  professionals: {
    list: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professional')
        .order('name');

      if (error) throw error;
      return data as Professional[];
    },

    getById: async (id: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'professional')
        .single();

      if (error) throw error;
      return data as Professional;
    },

    getAvailableSlots: async (professionalId: string, date: string) => {
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('date', date)
        .order('time');

      if (error) throw error;
      return data;
    },
  },
}; 