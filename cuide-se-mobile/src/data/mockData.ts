import { User, Professional, Service, Review, Appointment, Chat, Message, Notification, Payment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    location: 'São Paulo, SP',
    role: 'client',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana@email.com',
    phone: '(11) 98888-8888',
    location: 'Rio de Janeiro, RJ',
    role: 'client',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

export const mockProfessionals: Professional[] = [
  {
    id: '3',
    name: 'Carla Oliveira',
    email: 'carla@email.com',
    phone: '(11) 97777-7777',
    location: 'São Paulo, SP',
    role: 'professional',
    specialty: 'Manicure',
    bio: 'Especialista em unhas decoradas e alongamento. Mais de 5 anos de experiência.',
    portfolio: [
      'https://example.com/portfolio1.jpg',
      'https://example.com/portfolio2.jpg',
    ],
    services: [
      {
        id: '1',
        name: 'Manicure Completa',
        description: 'Inclui limpeza, cutículas, esmaltação e hidratação',
        duration: 60,
        price: 50,
        category: 'Manicure',
        professionalId: '3',
      },
      {
        id: '2',
        name: 'Esmaltação em Gel',
        description: 'Aplicação de esmalte em gel com duração de até 15 dias',
        duration: 90,
        price: 80,
        category: 'Manicure',
        professionalId: '3',
      },
    ],
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'Excelente profissional! Muito atenciosa e caprichosa.',
        clientId: '1',
        professionalId: '3',
        serviceId: '1',
        createdAt: '2024-01-15T00:00:00Z',
      },
    ],
    rating: 5,
    availability: [
      {
        id: '1',
        professionalId: '3',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '18:00',
        isAvailable: true,
      },
    ],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Patrícia Lima',
    email: 'patricia@email.com',
    phone: '(11) 96666-6666',
    location: 'São Paulo, SP',
    role: 'professional',
    specialty: 'Cabeleireira',
    bio: 'Especialista em coloração e cortes modernos. Formada pela L\'Oréal.',
    portfolio: [
      'https://example.com/portfolio3.jpg',
      'https://example.com/portfolio4.jpg',
    ],
    services: [
      {
        id: '3',
        name: 'Corte Feminino',
        description: 'Corte personalizado com lavagem e finalização',
        duration: 60,
        price: 70,
        category: 'Cabelo',
        professionalId: '4',
      },
      {
        id: '4',
        name: 'Coloração',
        description: 'Coloração profissional com produtos de alta qualidade',
        duration: 120,
        price: 150,
        category: 'Cabelo',
        professionalId: '4',
      },
    ],
    reviews: [
      {
        id: '2',
        rating: 4,
        comment: 'Muito boa profissional! Recomendo.',
        clientId: '2',
        professionalId: '4',
        serviceId: '3',
        createdAt: '2024-01-16T00:00:00Z',
      },
    ],
    rating: 4,
    availability: [
      {
        id: '2',
        professionalId: '4',
        dayOfWeek: 2,
        startTime: '10:00',
        endTime: '19:00',
        isAvailable: true,
      },
    ],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    professionalId: '3',
    serviceId: '1',
    date: '2024-02-01',
    time: '14:00',
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    clientId: '2',
    professionalId: '4',
    serviceId: '3',
    date: '2024-02-02',
    time: '15:00',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    clientId: '1',
    professionalId: '3',
    messages: [
      {
        id: '1',
        chatId: '1',
        senderId: '1',
        content: 'Olá! Gostaria de agendar um horário.',
        createdAt: '2024-01-20T10:00:00Z',
      },
      {
        id: '2',
        chatId: '1',
        senderId: '3',
        content: 'Claro! Qual horário você prefere?',
        createdAt: '2024-01-20T10:05:00Z',
      },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:05:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Agendamento confirmado',
    message: 'Seu agendamento com Carla Oliveira foi confirmado.',
    type: 'appointment',
    read: false,
    createdAt: '2024-01-20T11:00:00Z',
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    appointmentId: '1',
    amount: 50,
    status: 'paid',
    method: 'credit_card',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
]; 