import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { useStorage } from './useStorage';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  provider_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: Error | null;
}

interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
}

export const useServices = () => {
  const [state, setState] = useState<ServiceState>({
    services: [],
    loading: false,
    error: null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const { getItem, setItem } = useStorage();

  // Carrega os serviços
  const loadServices = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Tenta carregar do cache primeiro
      const cachedServices = await getItem('@CuideSe:services');
      if (cachedServices) {
        setState(prev => ({
          ...prev,
          services: cachedServices as Service[],
          loading: false,
        }));
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        services: data as Service[],
        loading: false,
      }));

      // Salva no cache
      await setItem('@CuideSe:services', data);

      // Registra o evento
      await logEvent('services_loaded', {
        count: data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar serviços'));
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao carregar serviços'),
        loading: false,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao carregar serviços',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [getItem, setItem, logEvent, showToast, recordError]);

  // Cria um novo serviço
  const createService = useCallback(
    async (data: CreateServiceData): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data: service, error } = await supabase
          .from('services')
          .insert([
            {
              ...data,
              provider_id: user.id,
              is_active: true,
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          services: [...prev.services, service as Service],
          loading: false,
        }));

        // Atualiza o cache
        const updatedServices = [...state.services, service as Service];
        await setItem('@CuideSe:services', updatedServices);

        // Registra o evento
        await logEvent('service_created', {
          user_id: user.id,
          service_id: service.id,
          category: data.category,
        });

        showToast({
          type: 'success',
          message: 'Serviço criado',
          description: 'Seu serviço foi criado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao criar serviço:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao criar serviço'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao criar serviço'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao criar serviço',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.services, setItem, logEvent, showToast, recordError]
  );

  // Atualiza um serviço
  const updateService = useCallback(
    async (id: string, updates: Partial<Service>): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .eq('provider_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          services: prev.services.map(service =>
            service.id === id ? (data as Service) : service
          ),
          loading: false,
        }));

        // Atualiza o cache
        const updatedServices = state.services.map(service =>
          service.id === id ? (data as Service) : service
        );
        await setItem('@CuideSe:services', updatedServices);

        // Registra o evento
        await logEvent('service_updated', {
          user_id: user.id,
          service_id: id,
          updates: Object.keys(updates),
        });

        showToast({
          type: 'success',
          message: 'Serviço atualizado',
          description: 'Seu serviço foi atualizado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar serviço'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar serviço'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar serviço',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.services, setItem, logEvent, showToast, recordError]
  );

  // Desativa um serviço
  const deactivateService = useCallback(
    async (id: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { error } = await supabase
          .from('services')
          .update({ is_active: false })
          .eq('id', id)
          .eq('provider_id', user.id);

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          services: prev.services.filter(service => service.id !== id),
          loading: false,
        }));

        // Atualiza o cache
        const updatedServices = state.services.filter(service => service.id !== id);
        await setItem('@CuideSe:services', updatedServices);

        // Registra o evento
        await logEvent('service_deactivated', {
          user_id: user.id,
          service_id: id,
        });

        showToast({
          type: 'success',
          message: 'Serviço desativado',
          description: 'Seu serviço foi desativado com sucesso',
        });
      } catch (error) {
        console.error('Erro ao desativar serviço:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao desativar serviço'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao desativar serviço'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao desativar serviço',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, state.services, setItem, logEvent, showToast, recordError]
  );

  // Filtra serviços por categoria
  const filterServicesByCategory = useCallback(
    (category: string): Service[] => {
      return state.services.filter(service => service.category === category);
    },
    [state.services]
  );

  // Filtra serviços por provedor
  const filterServicesByProvider = useCallback(
    (providerId: string): Service[] => {
      return state.services.filter(service => service.provider_id === providerId);
    },
    [state.services]
  );

  // Filtra serviços por preço
  const filterServicesByPrice = useCallback(
    (minPrice: number, maxPrice: number): Service[] => {
      return state.services.filter(
        service => service.price >= minPrice && service.price <= maxPrice
      );
    },
    [state.services]
  );

  // Filtra serviços por duração
  const filterServicesByDuration = useCallback(
    (maxDuration: number): Service[] => {
      return state.services.filter(service => service.duration <= maxDuration);
    },
    [state.services]
  );

  // Busca serviços por texto
  const searchServices = useCallback(
    (query: string): Service[] => {
      const normalizedQuery = query.toLowerCase();
      return state.services.filter(
        service =>
          service.name.toLowerCase().includes(normalizedQuery) ||
          service.description.toLowerCase().includes(normalizedQuery)
      );
    },
    [state.services]
  );

  return {
    ...state,
    loadServices,
    createService,
    updateService,
    deactivateService,
    filterServicesByCategory,
    filterServicesByProvider,
    filterServicesByPrice,
    filterServicesByDuration,
    searchServices,
  };
}; 