import { useState } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useLoading } from './useLoading';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  isActive: boolean;
}

interface UseServicesReturn {
  services: Service[];
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  getServicesByCategory: (category: string) => Service[];
  createService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const fetchServices = async () => {
    try {
      showLoading();
      setError(null);

      const response = await fetch(`${process.env.API_URL}/services`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar serviços');
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Erro ao carregar serviços');
      showToast('Erro ao carregar serviços', 'error');
    } finally {
      hideLoading();
    }
  };

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id);
  };

  const getServicesByCategory = (category: string) => {
    return services.filter((service) => service.category === category);
  };

  const createService = async (service: Omit<Service, 'id'>) => {
    try {
      showLoading();
      setError(null);

      const response = await fetch(`${process.env.API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar serviço');
      }

      const newService = await response.json();
      setServices((prev) => [...prev, newService]);
      showToast('Serviço criado com sucesso', 'success');
    } catch (err) {
      setError('Erro ao criar serviço');
      showToast('Erro ao criar serviço', 'error');
    } finally {
      hideLoading();
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      showLoading();
      setError(null);

      const response = await fetch(`${process.env.API_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar serviço');
      }

      const updatedService = await response.json();
      setServices((prev) =>
        prev.map((s) => (s.id === id ? updatedService : s))
      );
      showToast('Serviço atualizado com sucesso', 'success');
    } catch (err) {
      setError('Erro ao atualizar serviço');
      showToast('Erro ao atualizar serviço', 'error');
    } finally {
      hideLoading();
    }
  };

  const deleteService = async (id: string) => {
    try {
      showLoading();
      setError(null);

      const response = await fetch(`${process.env.API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir serviço');
      }

      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Serviço excluído com sucesso', 'success');
    } catch (err) {
      setError('Erro ao excluir serviço');
      showToast('Erro ao excluir serviço', 'error');
    } finally {
      hideLoading();
    }
  };

  return {
    services,
    error,
    fetchServices,
    getServiceById,
    getServicesByCategory,
    createService,
    updateService,
    deleteService,
  };
}; 