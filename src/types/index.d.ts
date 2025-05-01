import type { User as ApiUser, Professional as ApiProfessional, Service as ApiService, Review as ApiReview, Appointment as ApiAppointment, LoginCredentials, RegisterData, ApiResponse, Scheduling } from './api';
export interface User extends Omit<ApiUser, 'location'> {
    location: string;
}
export interface Professional extends Omit<ApiProfessional, 'role' | 'type'> {
    role: 'professional';
    type: 'professional';
    specialty: string;
    bio: string;
    portfolio: string[];
    services: ApiService[];
    reviews: ApiReview[];
}
export interface Service extends ApiService {
}
export interface Appointment extends ApiAppointment {
}
export interface Review extends ApiReview {
}
export type ApiResponse<T> = ApiResponse<T>;
export interface ProfessionalFilters {
    specialty?: string;
    city?: string;
    state?: string;
    minRating?: number;
    maxPrice?: number;
    availability?: {
        date: string;
        time: string;
    };
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
export interface LoginFormData {
    email: string;
    password: string;
}
export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'professional';
}
export interface SchedulingFormData {
    serviceId: string;
    date: string;
    time: string;
    professionalId: string;
}
export interface ReviewFormData {
    rating: number;
    comment: string;
    serviceId: string;
    professionalId: string;
}
export type { LoginCredentials, RegisterData, Scheduling };
