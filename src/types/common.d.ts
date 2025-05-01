export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: 'client' | 'professional';
    createdAt: string;
    updatedAt: string;
}
export interface Professional extends User {
    specialty: string;
    bio: string;
    portfolio: string[];
    services: Service[];
    reviews: Review[];
    rating: number;
    availability?: Availability[];
}
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    professionalId: string;
}
export interface Review {
    id: string;
    rating: number;
    comment: string;
    clientId: string;
    professionalId: string;
    serviceId: string;
    createdAt: string;
}
export interface Appointment {
    id: string;
    clientId: string;
    professionalId: string;
    serviceId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
}
export interface Availability {
    id: string;
    professionalId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
export interface Filter {
    specialty?: string;
    location?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    rating?: number;
    availability?: {
        date: string;
        time: string;
    };
}
