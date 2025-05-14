
import { AxiosInstance } from 'axios';

export interface ApiEndpoints {
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  getProfessionals: (filters?: any) => Promise<any>;
  getProfessionalById: (id: string) => Promise<any>;
  createAppointment: (appointmentData: any) => Promise<any>;
  getUserAppointments: () => Promise<any>;
}

interface Api extends ApiEndpoints {
  api: AxiosInstance;
}

declare const api: Api;
export default api;
