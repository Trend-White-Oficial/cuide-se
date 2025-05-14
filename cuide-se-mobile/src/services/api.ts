
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Criando uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: 'https://api.cuide-se.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Tratamento para token expirado (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Limpar dados de autenticação
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      
      // Aqui poderíamos redirecionar para a tela de login
      // ou emitir um evento para o contexto de autenticação
    }
    
    return Promise.reject(error);
  }
);

// Interface para tipar os endpoints da API
export interface ApiEndpoints {
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  getProfessionals: (filters?: any) => Promise<any>;
  getProfessionalById: (id: string) => Promise<any>;
  createAppointment: (appointmentData: any) => Promise<any>;
  getUserAppointments: () => Promise<any>;
}

// Implementação dos endpoints
const endpoints: ApiEndpoints = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  getProfessionals: (filters) => {
    return api.get('/professionals', { params: filters });
  },
  getProfessionalById: (id) => {
    return api.get(`/professionals/${id}`);
  },
  createAppointment: (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },
  getUserAppointments: () => {
    return api.get('/appointments/user');
  },
};

export default {
  api,
  ...endpoints,
};
