import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useToast } from './useToast';
import { useTranslation } from './useTranslation';

interface Appointment {
  id: string;
  serviceId: string;
  professionalId: string;
  clientId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  duration: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAppointmentData {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  notes?: string;
}

interface UpdateAppointmentData {
  date?: string;
  time?: string;
  status?: Appointment['status'];
  notes?: string;
}

export const useAppointments = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Buscar todos os agendamentos
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<Appointment[]>(
    'appointments',
    async () => {
      const response = await api.get('/appointments');
      return response.data;
    },
    {
      onError: () => {
        showToast(
          t('errors.appointments.fetch'),
          t('errors.appointments.fetchMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Buscar agendamento por ID
  const { data: appointment, isLoading: isLoadingAppointment } = useQuery<Appointment>(
    ['appointment', selectedAppointment?.id],
    async () => {
      const response = await api.get(`/appointments/${selectedAppointment?.id}`);
      return response.data;
    },
    {
      enabled: !!selectedAppointment?.id,
      onError: () => {
        showToast(
          t('errors.appointments.fetch'),
          t('errors.appointments.fetchMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Criar agendamento
  const createAppointment = useMutation(
    async (data: CreateAppointmentData) => {
      const response = await api.post('/appointments', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        showToast(
          t('success.appointments.create'),
          t('success.appointments.createMessage'),
          { type: 'success' }
        );
      },
      onError: () => {
        showToast(
          t('errors.appointments.create'),
          t('errors.appointments.createMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Atualizar agendamento
  const updateAppointment = useMutation(
    async ({ id, data }: { id: string; data: UpdateAppointmentData }) => {
      const response = await api.put(`/appointments/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        showToast(
          t('success.appointments.update'),
          t('success.appointments.updateMessage'),
          { type: 'success' }
        );
      },
      onError: () => {
        showToast(
          t('errors.appointments.update'),
          t('errors.appointments.updateMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Cancelar agendamento
  const cancelAppointment = useMutation(
    async (id: string) => {
      const response = await api.put(`/appointments/${id}/cancel`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        showToast(
          t('success.appointments.cancel'),
          t('success.appointments.cancelMessage'),
          { type: 'success' }
        );
      },
      onError: () => {
        showToast(
          t('errors.appointments.cancel'),
          t('errors.appointments.cancelMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Confirmar agendamento
  const confirmAppointment = useMutation(
    async (id: string) => {
      const response = await api.put(`/appointments/${id}/confirm`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        showToast(
          t('success.appointments.confirm'),
          t('success.appointments.confirmMessage'),
          { type: 'success' }
        );
      },
      onError: () => {
        showToast(
          t('errors.appointments.confirm'),
          t('errors.appointments.confirmMessage'),
          { type: 'error' }
        );
      },
    }
  );

  // Completar agendamento
  const completeAppointment = useMutation(
    async (id: string) => {
      const response = await api.put(`/appointments/${id}/complete`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        showToast(
          t('success.appointments.complete'),
          t('success.appointments.completeMessage'),
          { type: 'success' }
        );
      },
      onError: () => {
        showToast(
          t('errors.appointments.complete'),
          t('errors.appointments.completeMessage'),
          { type: 'error' }
        );
      },
    }
  );

  return {
    appointments,
    appointment,
    selectedAppointment,
    setSelectedAppointment,
    isLoadingAppointments,
    isLoadingAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
  };
}; 