import type { User, Professional, Service, Review, Appointment, LoginCredentials, RegisterData, ApiResponse, Scheduling } from '@/types/api';
declare const api: import("axios").AxiosInstance;
export declare const authService: {
    login: (credentials: LoginCredentials) => Promise<import("axios").AxiosResponse<ApiResponse<{
        token: string;
        user: User;
    }>, any>>;
    register: (userData: RegisterData) => Promise<import("axios").AxiosResponse<ApiResponse<{
        token: string;
        user: User;
    }>, any>>;
    logout: () => Promise<import("axios").AxiosResponse<any, any>>;
};
export declare const professionalService: {
    getAll: (params?: {
        specialty?: string;
        city?: string;
        rating?: number;
        page?: number;
        limit?: number;
    }) => Promise<import("axios").AxiosResponse<ApiResponse<Professional[]>, any>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Professional>, any>>;
    getServices: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Service[]>, any>>;
    getReviews: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Review[]>, any>>;
    update: (id: string, data: Partial<Professional>) => Promise<import("axios").AxiosResponse<ApiResponse<Professional>, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<void>, any>>;
};
export declare const schedulingService: {
    create: (data: Omit<Scheduling, "id" | "createdAt" | "updatedAt" | "user" | "professional" | "service">) => Promise<import("axios").AxiosResponse<ApiResponse<Scheduling>, any>>;
    getByUser: () => Promise<import("axios").AxiosResponse<ApiResponse<Scheduling[]>, any>>;
    getByProfessional: () => Promise<import("axios").AxiosResponse<ApiResponse<Scheduling[]>, any>>;
    cancel: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Scheduling>, any>>;
};
export declare const reviewService: {
    getAll: () => Promise<import("axios").AxiosResponse<ApiResponse<Review[]>, any>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Review>, any>>;
    create: (data: Partial<Review>) => Promise<import("axios").AxiosResponse<ApiResponse<Review>, any>>;
    update: (id: string, data: Partial<Review>) => Promise<import("axios").AxiosResponse<ApiResponse<Review>, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<void>, any>>;
    getByProfessional: (professionalId: string) => Promise<import("axios").AxiosResponse<ApiResponse<Review[]>, any>>;
    getByUser: (userId: string) => Promise<import("axios").AxiosResponse<ApiResponse<Review[]>, any>>;
};
export declare const appointmentService: {
    getAll: () => Promise<import("axios").AxiosResponse<ApiResponse<Appointment[]>, any>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Appointment>, any>>;
    create: (data: Scheduling) => Promise<import("axios").AxiosResponse<ApiResponse<Appointment>, any>>;
    update: (id: string, data: Partial<Appointment>) => Promise<import("axios").AxiosResponse<ApiResponse<Appointment>, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<void>, any>>;
    getByUser: (userId: string) => Promise<import("axios").AxiosResponse<ApiResponse<Appointment[]>, any>>;
    getByProfessional: (professionalId: string) => Promise<import("axios").AxiosResponse<ApiResponse<Appointment[]>, any>>;
};
export declare const serviceService: {
    getAll: () => Promise<import("axios").AxiosResponse<ApiResponse<Service[]>, any>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<Service>, any>>;
    create: (data: Partial<Service>) => Promise<import("axios").AxiosResponse<ApiResponse<Service>, any>>;
    update: (id: string, data: Partial<Service>) => Promise<import("axios").AxiosResponse<ApiResponse<Service>, any>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<ApiResponse<void>, any>>;
};
export declare const notificationsService: {
    getAll: () => Promise<any[]>;
};
export { api };
