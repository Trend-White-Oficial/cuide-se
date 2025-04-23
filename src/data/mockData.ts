
import { Professional, Appointment, User } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
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
  }
];

// Mock Professionals
export const mockProfessionals: Professional[] = [
  {
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
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
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
export const getProfessionalById = (id: string): Professional | undefined => {
  return mockProfessionals.find(professional => professional.id === id);
};

// Get User by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Get Appointments by Client ID
export const getAppointmentsByClientId = (clientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.clientId === clientId);
};

// Get Appointments by Professional ID
export const getAppointmentsByProfessionalId = (professionalId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.professionalId === professionalId);
};
