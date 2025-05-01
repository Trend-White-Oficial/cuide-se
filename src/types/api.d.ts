export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'professional';
    type: 'client' | 'professional';
    location?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Professional extends User {
    specialties: string[];
    specialty?: string;
    description: string;
    bio?: string;
    experience: number;
    rating: number;
    totalReviews: number;
    appointments: number;
    status: 'active' | 'inactive';
    portfolio?: string[];
    services?: Service[];
    reviews?: Review[];
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    workingHours: {
        [key: string]: {
            start: string;
            end: string;
        };
    };
    paymentMethods?: string[];
}
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    professionalId: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}
export interface Review {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    professionalId: string;
    serviceId: string;
    date: string;
    clientName: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}
export interface Appointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    time?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    userId: string;
    clientId?: string;
    professionalId: string;
    serviceId: string;
    service?: string;
    clientName: string;
    professionalName: string;
    serviceName: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    professional: Professional;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'user' | 'professional';
}
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}
export interface Scheduling {
    professionalId: string;
    serviceId: string;
    date: string;
    time: string;
    userId: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}
