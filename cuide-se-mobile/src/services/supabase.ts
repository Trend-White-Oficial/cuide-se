import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { API_CONFIG } from '../config';
import { supabase, getSupabaseError, handleSupabaseError } from '../config/supabase';
import type { User, Profile, Service, Appointment, Review, Payment } from '../config/supabase';

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

// Serviços de Autenticação
export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
};

// Serviços de Perfil
export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data as Profile;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
};

// Serviços de Agendamento
export const appointmentService = {
  async getAppointments(userId: string, role: 'client' | 'professional') {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq(`${role}_id`, userId)
        .order('date', { ascending: true });
      if (error) throw error;
      return data as Appointment[];
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();
      if (error) throw error;
      return data as Appointment;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async updateAppointment(id: string, updates: Partial<Appointment>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Appointment;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
};

// Serviços de Avaliação
export const reviewService = {
  async getReviews(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data as Review;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
};

// Serviços de Pagamento
export const paymentService = {
  async getPayments(appointmentId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Payment[];
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();
      if (error) throw error;
      return data as Payment;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async updatePaymentStatus(id: string, status: Payment['status']) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Payment;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
}; 