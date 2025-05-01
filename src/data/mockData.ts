import type { User, Professional, Service, Review, Appointment } from '@/types/api';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
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
  }
];

// Mock Professionals
export const mockProfessionals: Professional[] = [
  {
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
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
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
export const getProfessionalById = (id: string): Professional | undefined => {
  return mockProfessionals.find(professional => professional.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getAppointmentsByClientId = (clientId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.userId === clientId);
};

export const getAppointmentsByProfessionalId = (professionalId: string): Appointment[] => {
  return mockAppointments.filter(appointment => appointment.professionalId === professionalId);
};
