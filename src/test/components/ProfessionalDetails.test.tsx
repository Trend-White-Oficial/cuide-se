import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfessionalDetails } from '@/components/ProfessionalDetails';
import type { Professional } from '@/types/api';

const mockProfessional: Professional = {
  id: '1',
  name: 'Dr. João Silva',
  email: 'joao@example.com',
  phone: '(11) 99999-9999',
  role: 'professional',
  type: 'professional',
  specialties: ['Psicologia', 'Terapia Cognitivo-Comportamental'],
  description: 'Psicólogo especializado em terapia cognitivo-comportamental com 10 anos de experiência.',
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
};

describe('ProfessionalDetails', () => {
  it('deve renderizar os detalhes do profissional corretamente', () => {
    render(<ProfessionalDetails professional={mockProfessional} />);

    // Verifica se o nome do profissional está presente
    expect(screen.getByText('Dr. João Silva')).toBeInTheDocument();

    // Verifica se as especialidades estão presentes
    expect(screen.getByText('Psicologia')).toBeInTheDocument();
    expect(screen.getByText('Terapia Cognitivo-Comportamental')).toBeInTheDocument();

    // Verifica se a descrição está presente
    expect(screen.getByText('Psicólogo especializado em terapia cognitivo-comportamental com 10 anos de experiência.')).toBeInTheDocument();

    // Verifica se a avaliação está presente
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(156 avaliações)')).toBeInTheDocument();

    // Verifica se o endereço está presente
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();
  });

  it('deve renderizar o horário de atendimento corretamente', () => {
    render(<ProfessionalDetails professional={mockProfessional} />);

    // Verifica se o título do horário de atendimento está presente
    expect(screen.getByText('Horário de Atendimento')).toBeInTheDocument();

    // Verifica se os dias da semana estão presentes
    expect(screen.getByText('Segunda à Sexta')).toBeInTheDocument();

    // Verifica se o horário está presente
    expect(screen.getByText('09:00 - 18:00')).toBeInTheDocument();
  });
}); 