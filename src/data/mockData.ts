<<<<<<< HEAD
import type { User, Professional, Service, Review, Appointment } from '@/types/api';
=======

import { Professional, Appointment, User } from '../types';
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
<<<<<<< HEAD
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    role: 'user',
    type: 'client',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 98888-8888',
    role: 'user',
    type: 'client',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    phone: '(11) 97777-7777',
    role: 'user',
    type: 'client',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
=======
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '(11) 99999-1111',
    location: 'São Paulo, SP',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    email: 'ana@example.com',
    phone: '(11) 99999-2222',
    location: 'São Paulo, SP',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8
  }
];

// Mock Professionals
export const mockProfessionals: Professional[] = [
  {
<<<<<<< HEAD
    id: '1',
    name: 'Dr. Ana Silva',
    email: 'ana@example.com',
    phone: '(11) 96666-6666',
    role: 'professional',
    type: 'professional',
    specialties: ['Psicologia', 'Terapia Cognitivo-Comportamental'],
    description: 'Psicóloga especializada em terapia cognitivo-comportamental',
    experience: 10,
    rating: 4.8,
    totalReviews: 156,
    appointments: 156,
    status: 'active',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Sala 45',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' }
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Dr. Carlos Santos',
    email: 'carlos@example.com',
    phone: '(11) 95555-5555',
    role: 'professional',
    type: 'professional',
    specialties: ['Psiquiatria', 'Neuropsiquiatria'],
    description: 'Psiquiatra com foco em tratamento de ansiedade e depressão',
    experience: 15,
    rating: 4.9,
    totalReviews: 98,
    appointments: 98,
    status: 'active',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Conjunto 123',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    workingHours: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' }
    },
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
=======
    id: '101',
    name: 'Juliana Mendes',
    email: 'juliana@example.com',
    phone: '(11) 99999-3333',
    location: 'São Paulo, SP',
    role: 'professional',
    specialty: 'Manicure',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=300&auto=format&fit=crop'
    ],
    bio: 'Especialista em unhas decoradas, com 5 anos de experiência.',
    services: [
      {
        id: '1001',
        name: 'Manicure Simples',
        description: 'Corte, lixamento e esmaltação básica.',
        duration: 45,
        price: 35
      },
      {
        id: '1002',
        name: 'Manicure com Decoração',
        description: 'Manicure completa com nail art e decorações exclusivas.',
        duration: 60,
        price: 50
      }
    ],
    rating: 4.8,
    reviews: [
      {
        id: '10001',
        clientId: '1',
        clientName: 'Maria Silva',
        rating: 5,
        comment: 'Trabalho impecável e muito atenciosa.',
        date: '2023-10-15'
      },
      {
        id: '10002',
        clientId: '2',
        clientName: 'Ana Oliveira',
        rating: 4.5,
        comment: 'Adorei o resultado, muito profissional.',
        date: '2023-09-28'
      }
    ]
  },
  {
    id: '102',
    name: 'Fernanda Costa',
    email: 'fernanda@example.com',
    phone: '(11) 99999-4444',
    location: 'São Paulo, SP',
    role: 'professional',
    specialty: 'Cabeleireira',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop'
    ],
    bio: 'Cabeleireira profissional especializada em cortes modernos e coloração.',
    services: [
      {
        id: '2001',
        name: 'Corte Feminino',
        description: 'Corte personalizado de acordo com o formato do rosto.',
        duration: 60,
        price: 70
      },
      {
        id: '2002',
        name: 'Coloração',
        description: 'Tintura profissional com produtos de alta qualidade.',
        duration: 120,
        price: 150
      }
    ],
    rating: 4.9,
    reviews: [
      {
        id: '20001',
        clientId: '1',
        clientName: 'Maria Silva',
        rating: 5,
        comment: 'Melhor cabeleireira que já conheci!',
        date: '2023-10-10'
      }
    ]
  },
  {
    id: '103',
    name: 'Carolina Santos',
    email: 'carolina@example.com',
    phone: '(11) 99999-5555',
    location: 'São Paulo, SP',
    role: 'professional',
    specialty: 'Especialista em Cílios',
    avatar: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=150&auto=format&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1588421357574-87938a86fa28?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516914589923-f105f8ec34a5?q=80&w=300&auto=format&fit=crop'
    ],
    bio: 'Especialista em extensão de cílios, com técnicas fio a fio e volume russo.',
    services: [
      {
        id: '3001',
        name: 'Cílios Fio a Fio',
        description: 'Aplicação clássica fio a fio para um olhar natural.',
        duration: 90,
        price: 120
      },
      {
        id: '3002',
        name: 'Volume Russo',
        description: 'Técnica para maior volume e definição dos cílios.',
        duration: 120,
        price: 180
      }
    ],
    rating: 4.7,
    reviews: [
      {
        id: '30001',
        clientId: '2',
        clientName: 'Ana Oliveira',
        rating: 4.7,
        comment: 'Cílios perfeitos e duradouros!',
        date: '2023-09-15'
      }
    ]
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
<<<<<<< HEAD
    id: '1',
    date: '2024-02-01',
    startTime: '09:00',
    endTime: '10:00',
    status: 'completed',
    userId: '1',
    professionalId: '1',
    serviceId: '1',
    clientName: 'João Silva',
    professionalName: 'Dr. Ana Silva',
    serviceName: 'Consulta Psicológica',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    user: mockUsers[0],
    professional: mockProfessionals[0]
  },
  {
    id: '2',
    date: '2024-02-02',
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    userId: '2',
    professionalId: '2',
    serviceId: '2',
    clientName: 'Maria Santos',
    professionalName: 'Dr. Carlos Santos',
    serviceName: 'Consulta Psiquiátrica',
    createdAt: '2024-01-16T00:00:00.000Z',
    updatedAt: '2024-01-16T00:00:00.000Z',
    user: mockUsers[1],
    professional: mockProfessionals[1]
  }
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Consulta Psicológica',
    description: 'Atendimento psicológico individual',
    duration: 60,
    price: 200,
    professionalId: '1',
    category: 'Psicologia',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Consulta Psiquiátrica',
    description: 'Avaliação e acompanhamento psiquiátrico',
    duration: 60,
    price: 300,
    professionalId: '2',
    category: 'Psiquiatria',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    comment: 'Excelente profissional!',
    userId: '1',
    professionalId: '1',
    serviceId: '1',
    date: '2024-01-20',
    clientName: 'João Silva',
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
    user: mockUsers[0]
  },
  {
    id: '2',
    rating: 4,
    comment: 'Muito bom atendimento',
    userId: '2',
    professionalId: '2',
    serviceId: '2',
    date: '2024-01-21',
    clientName: 'Maria Santos',
    createdAt: '2024-01-21T00:00:00.000Z',
    updatedAt: '2024-01-21T00:00:00.000Z',
    user: mockUsers[1]
  }
];

// Helper functions
=======
    id: 'a101',
    clientId: '1',
    professionalId: '101',
    serviceId: '1001',
    date: '2023-11-10',
    time: '14:00',
    status: 'completed'
  },
  {
    id: 'a102',
    clientId: '1',
    professionalId: '102',
    serviceId: '2001',
    date: '2023-11-15',
    time: '10:00',
    status: 'confirmed'
  },
  {
    id: 'a103',
    clientId: '2',
    professionalId: '103',
    serviceId: '3001',
    date: '2023-11-20',
    time: '16:30',
    status: 'pending'
  }
];

// Get Professional by ID
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8
export const getProfessionalById = (id: string): Professional | undefined => {
  return mockProfessionals.find(professional => professional.id === id);
};

<<<<<<< HEAD
=======
// Get User by ID
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

<<<<<<< HEAD
export const getAppointmentsByClientId = (clientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.userId === clientId);
};

=======
// Get Appointments by Client ID
export const getAppointmentsByClientId = (clientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.clientId === clientId);
};

// Get Appointments by Professional ID
>>>>>>> 31a9e08cc82b0539daf1062986390a8a12792fd8
export const getAppointmentsByProfessionalId = (professionalId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.professionalId === professionalId);
};
