import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useToast } from './useToast';
import { useTranslation } from './useTranslation';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
}

interface UpdateServiceData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export const useServices = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Buscar todos os serviços
  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>(
    'services',
    async () => {
      const response = await api.get('/services');
      return response.data;
    },
    {
      onError: () => {
        showToast(
          t('errors.services.fetch'),
          t('errors.services.fetchMessage')
        );
      },
    }
  );

  // Buscar serviço por ID
  const { data: service, isLoading: isLoadingService } = useQuery<Service>(
    ['service', selectedService?.id],
    async () => {
      const response = await api.get(`/services/${selectedService?.id}`);
      return response.data;
    },
    {
      enabled: !!selectedService?.id,
      onError: () => {
        showToast(
          t('errors.services.fetch'),
          t('errors.services.fetchMessage')
        );
      },
    }
  );

  // Criar serviço
  const createService = useMutation(
    async (data: CreateServiceData) => {
      const response = await api.post('/services', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
        showToast(
          t('success.services.create'),
          t('success.services.createMessage')
        );
      },
      onError: () => {
        showToast(
          t('errors.services.create'),
          t('errors.services.createMessage')
        );
      },
    }
  );

  // Atualizar serviço
  const updateService = useMutation(
    async ({ id, data }: { id: string; data: UpdateServiceData }) => {
      const response = await api.put(`/services/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
        showToast(
          t('success.services.update'),
          t('success.services.updateMessage')
        );
      },
      onError: () => {
        showToast(
          t('errors.services.update'),
          t('errors.services.updateMessage')
        );
      },
    }
  );

  // Desativar serviço
  const deactivateService = useMutation(
    async (id: string) => {
      const response = await api.put(`/services/${id}/deactivate`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
        showToast(
          t('success.services.deactivate'),
          t('success.services.deactivateMessage')
        );
      },
      onError: () => {
        showToast(
          t('errors.services.deactivate'),
          t('errors.services.deactivateMessage')
        );
      },
    }
  );

  // Ativar serviço
  const activateService = useMutation(
    async (id: string) => {
      const response = await api.put(`/services/${id}/activate`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
        showToast(
          t('success.services.activate'),
          t('success.services.activateMessage')
        );
      },
      onError: () => {
        showToast(
          t('errors.services.activate'),
          t('errors.services.activateMessage')
        );
      },
    }
  );

  return {
    services,
    service,
    selectedService,
    setSelectedService,
    isLoadingServices,
    isLoadingService,
    createService,
    updateService,
    deactivateService,
    activateService,
  };
}; 