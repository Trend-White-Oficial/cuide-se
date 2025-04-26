import axios from 'axios';
import type {
  User,
  Professional,
  Service,
  Review,
  Appointment,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  Scheduling
} from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: (credentials: LoginCredentials) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials),
  
  register: (userData: RegisterData) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
};

// Serviços de profissionais
export const professionalService = {
  getAll: (params?: { 
    specialty?: string;
    city?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }) =>
    api.get<ApiResponse<Professional[]>>('/professionals', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<Professional>>(`/professionals/${id}`),
  
  getServices: (id: string) =>
    api.get<ApiResponse<Service[]>>(`/professionals/${id}/services`),
  
  getReviews: (id: string) =>
    api.get<ApiResponse<Review[]>>(`/professionals/${id}/reviews`),
  
  update: (id: string, data: Partial<Professional>) =>
    api.put<ApiResponse<Professional>>(`/professionals/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/professionals/${id}`),
};

// Serviços de agendamento
export const schedulingService = {
  create: (data: Omit<Scheduling, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'professional' | 'service'>) =>
    api.post<ApiResponse<Scheduling>>('/scheduling', data),
  
  getByUser: () =>
    api.get<ApiResponse<Scheduling[]>>('/scheduling/user'),
  
  getByProfessional: () =>
    api.get<ApiResponse<Scheduling[]>>('/scheduling/professional'),
  
  cancel: (id: string) =>
    api.post<ApiResponse<Scheduling>>(`/scheduling/${id}/cancel`),
};

// Serviços de avaliações
export const reviewService = {
  getAll: () => api.get<ApiResponse<Review[]>>('/reviews'),
  getById: (id: string) => api.get<ApiResponse<Review>>(`/reviews/${id}`),
  create: (data: Partial<Review>) => api.post<ApiResponse<Review>>('/reviews', data),
  update: (id: string, data: Partial<Review>) => api.put<ApiResponse<Review>>(`/reviews/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/reviews/${id}`),
  getByProfessional: (professionalId: string) => api.get<ApiResponse<Review[]>>(`/reviews/professional/${professionalId}`),
  getByUser: (userId: string) => api.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`),
};

export const appointmentService = {
  getAll: () => api.get<ApiResponse<Appointment[]>>('/appointments'),
  getById: (id: string) => api.get<ApiResponse<Appointment>>(`/appointments/${id}`),
  create: (data: Scheduling) => api.post<ApiResponse<Appointment>>('/appointments', data),
  update: (id: string, data: Partial<Appointment>) => api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/appointments/${id}`),
  getByUser: (userId: string) => api.get<ApiResponse<Appointment[]>>(`/appointments/user/${userId}`),
  getByProfessional: (professionalId: string) => api.get<ApiResponse<Appointment[]>>(`/appointments/professional/${professionalId}`),
};

export const serviceService = {
  getAll: () => api.get<ApiResponse<Service[]>>('/services'),
  getById: (id: string) => api.get<ApiResponse<Service>>(`/services/${id}`),
  create: (data: Partial<Service>) => api.post<ApiResponse<Service>>('/services', data),
  update: (id: string, data: Partial<Service>) => api.put<ApiResponse<Service>>(`/services/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/services/${id}`),
};

export { api }; 