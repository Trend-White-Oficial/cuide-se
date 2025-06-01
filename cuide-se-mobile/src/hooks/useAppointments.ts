import { useState } from 'react';
import { supabase } from '../services/supabase';

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  services: {
    name: string;
    price: number;
    duration: number;
  };
  professionals: {
    name: string;
    avatar_url?: string;
  };
}

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          date,
          time,
          status,
          services (
            name,
            price,
            duration
          ),
          professionals (
            name,
            avatar_url
          )
        `)
        .eq('client_id', userId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setError('Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: {
    client_id: string;
    professional_id: string;
    service_id: string;
    date: string;
    time: string;
    status: string;
    price: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setError('Não foi possível criar o agendamento.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      setError('Não foi possível atualizar o status do agendamento.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    return updateAppointmentStatus(appointmentId, 'cancelled');
  };

  const confirmAppointment = async (appointmentId: string) => {
    return updateAppointmentStatus(appointmentId, 'confirmed');
  };

  const completeAppointment = async (appointmentId: string) => {
    return updateAppointmentStatus(appointmentId, 'completed');
  };

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
  };
}; 