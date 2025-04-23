
export type UserRole = 'client' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: UserRole;
  avatar?: string;
}

export interface Professional extends User {
  specialty: string;
  portfolio: string[];
  bio: string;
  services: Service[];
  rating: number;
  reviews: Review[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}
