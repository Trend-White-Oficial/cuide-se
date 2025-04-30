import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfessionalCard } from '@/components/ProfessionalCard';
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

describe('ProfessionalCard', () => {
  it('deve renderizar o card do profissional corretamente', () => {
    render(<ProfessionalCard professional={mockProfessional} />);

    // Verifica se o nome do profissional está presente
    expect(screen.getByText('Dr. João Silva')).toBeInTheDocument();

    // Verifica se a especialidade principal está presente
    expect(screen.getByText('Psicologia')).toBeInTheDocument();

    // Verifica se a avaliação está presente
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(156 avaliações)')).toBeInTheDocument();

    // Verifica se o endereço está presente
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument();

    // Verifica se a descrição está presente
    expect(screen.getByText('Psicólogo especializado em terapia cognitivo-comportamental com 10 anos de experiência.')).toBeInTheDocument();
  });

  it('deve renderizar o link para a página de detalhes do profissional', () => {
    render(<ProfessionalCard professional={mockProfessional} />);

    // Verifica se o link está presente com o href correto
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/professionals/1');
  });
}); 