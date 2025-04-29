export type UserRole = 'client' | 'professional';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseUser {}

export interface Professional extends BaseUser {
  specialty: string;
  bio: string;
  portfolio: string[];
  services: Service[];
  reviews: Review[];
  rating: number;
  availability?: Availability[];
}

export interface BaseAppointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
}

export interface Appointment extends BaseAppointment {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
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

export interface Availability {
  id: string;
  professionalId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface AvailabilityFilter {
  date: string;
  time: string;
}

export interface Filter {
  specialty?: string;
  location?: string;
  priceRange?: PriceRange;
  rating?: number;
  availability?: AvailabilityFilter;
}
