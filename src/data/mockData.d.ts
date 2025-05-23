import type { User, Professional, Service, Review, Appointment } from '@/types/api';
export declare const mockUsers: User[];
export declare const mockProfessionals: Professional[];
export declare const mockAppointments: Appointment[];
export declare const mockServices: Service[];
export declare const mockReviews: Review[];
export declare const getProfessionalById: (id: string) => Professional | undefined;
export declare const getUserById: (id: string) => User | undefined;
export declare const getAppointmentsByClientId: (clientId: string) => Appointment[];
export declare const getAppointmentsByProfessionalId: (professionalId: string) => Appointment[];
