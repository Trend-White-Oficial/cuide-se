import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { useNotifications } from './useNotifications';

interface Appointment {
  id: string;
  user_id: string;
  service_id: string;
  provider_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: Error | null;
}

interface CreateAppointmentData {
  service_id: string;
  provider_id: string;
  date: string;
  time: string;
  notes?: string;
}

export const useAppointments = () => {
  const [state, setState] = useState<AppointmentState>({
    appointments: [],
    loading: false,
    error: null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const { scheduleNotification } = useNotifications();

  // Carrega os agendamentos do usuário
  const loadAppointments = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        appointments: data as Appointment[],
        loading: false,
      }));

      // Registra o evento
      await logEvent('appointments_loaded', {
        user_id: user.id,
        count: data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar agendamentos'));
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao carregar agendamentos'),
        loading: false,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao carregar agendamentos',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [user, logEvent, showToast, recordError]);

  // Cria um novo agendamento
  const createAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data: appointment, error } = await supabase
          .from('appointments')
          .insert([
            {
              user_id: user.id,
              ...data,
              status: 'scheduled',
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          appointments: [...prev.appointments, appointment as Appointment],
          loading: false,
        }));

        // Agenda notificação
        await scheduleNotification({
          title: 'Agendamento Confirmado',
          body: `Seu agendamento foi confirmado para ${data.date} às ${data.time}`,
          date: new Date(`${data.date}T${data.time}`),
        });

        // Registra o evento
        await logEvent('appointment_created', {
          user_id: user.id,
          service_id: data.service_id,
          provider_id: data.provider_id,
          date: data.date,
          time: data.time,
        });

        showToast({
          type: 'success',
          message: 'Agendamento criado',
          description: 'Seu agendamento foi confirmado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao criar agendamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao criar agendamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao criar agendamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, scheduleNotification, logEvent, showToast, recordError]
  );

  // Atualiza um agendamento
  const updateAppointment = useCallback(
    async (id: string, updates: Partial<Appointment>): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('appointments')
          .update(updates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(appointment =>
            appointment.id === id ? (data as Appointment) : appointment
          ),
          loading: false,
        }));

        // Registra o evento
        await logEvent('appointment_updated', {
          user_id: user.id,
          appointment_id: id,
          updates: Object.keys(updates),
        });

        showToast({
          type: 'success',
          message: 'Agendamento atualizado',
          description: 'Seu agendamento foi atualizado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar agendamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar agendamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar agendamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  // Cancela um agendamento
  const cancelAppointment = useCallback(
    async (id: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { error } = await supabase
          .from('appointments')
          .update({ status: 'cancelled' })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(appointment =>
            appointment.id === id
              ? { ...appointment, status: 'cancelled' }
              : appointment
          ),
          loading: false,
        }));

        // Registra o evento
        await logEvent('appointment_cancelled', {
          user_id: user.id,
          appointment_id: id,
        });

        showToast({
          type: 'success',
          message: 'Agendamento cancelado',
          description: 'Seu agendamento foi cancelado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao cancelar agendamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao cancelar agendamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao cancelar agendamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  // Completa um agendamento
  const completeAppointment = useCallback(
    async (id: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { error } = await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          appointments: prev.appointments.map(appointment =>
            appointment.id === id
              ? { ...appointment, status: 'completed' }
              : appointment
          ),
          loading: false,
        }));

        // Registra o evento
        await logEvent('appointment_completed', {
          user_id: user.id,
          appointment_id: id,
        });

        showToast({
          type: 'success',
          message: 'Agendamento concluído',
          description: 'Seu agendamento foi marcado como concluído',
        });
      } catch (error) {
        console.error('Erro ao completar agendamento:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao completar agendamento'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao completar agendamento'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao completar agendamento',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, logEvent, showToast, recordError]
  );

  // Filtra agendamentos por status
  const filterAppointmentsByStatus = useCallback(
    (status: Appointment['status']): Appointment[] => {
      return state.appointments.filter(appointment => appointment.status === status);
    },
    [state.appointments]
  );

  // Filtra agendamentos por data
  const filterAppointmentsByDate = useCallback(
    (date: string): Appointment[] => {
      return state.appointments.filter(appointment => appointment.date === date);
    },
    [state.appointments]
  );

  // Filtra agendamentos por provedor
  const filterAppointmentsByProvider = useCallback(
    (providerId: string): Appointment[] => {
      return state.appointments.filter(
        appointment => appointment.provider_id === providerId
      );
    },
    [state.appointments]
  );

  // Filtra agendamentos por serviço
  const filterAppointmentsByService = useCallback(
    (serviceId: string): Appointment[] => {
      return state.appointments.filter(
        appointment => appointment.service_id === serviceId
      );
    },
    [state.appointments]
  );

  return {
    ...state,
    loadAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    filterAppointmentsByStatus,
    filterAppointmentsByDate,
    filterAppointmentsByProvider,
    filterAppointmentsByService,
  };
}; 