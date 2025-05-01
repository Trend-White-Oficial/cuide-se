export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    location: string;
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
    availability: Availability[];
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
    createdAt: string;
    updatedAt: string;
}
export interface Availability {
    id: string;
    professionalId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
export interface Chat {
    id: string;
    clientId: string;
    professionalId: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
}
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'appointment' | 'message' | 'payment' | 'system';
    read: boolean;
    createdAt: string;
}
export interface Payment {
    id: string;
    appointmentId: string;
    amount: number;
    status: 'pending' | 'paid' | 'refunded';
    method: 'credit_card' | 'pix' | 'bank_transfer';
    createdAt: string;
    updatedAt: string;
}
export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
}
export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
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
