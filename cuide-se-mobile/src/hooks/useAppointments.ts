import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../types';
import { useAuth } from './useAuth';

interface CreateAppointmentData {
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export function useAppointments() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await fetch('https://api.cuide-se.com/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar agendamentos');
      }

      return response.json();
    },
    enabled: !!token,
  });

  const createAppointment = useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      const response = await fetch('https://api.cuide-se.com/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar agendamento');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`https://api.cuide-se.com/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cancelar agendamento');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const getPendingAppointments = () => {
    return appointments?.filter((appointment: Appointment) => 
      appointment.status === 'pending' || appointment.status === 'confirmed'
    ) || [];
  };

  const getCompletedAppointments = () => {
    return appointments?.filter((appointment: Appointment) => 
      appointment.status === 'completed'
    ) || [];
  };

  const getCancelledAppointments = () => {
    return appointments?.filter((appointment: Appointment) => 
      appointment.status === 'cancelled'
    ) || [];
  };

  return {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    getPendingAppointments,
    getCompletedAppointments,
    getCancelledAppointments,
  };
} 