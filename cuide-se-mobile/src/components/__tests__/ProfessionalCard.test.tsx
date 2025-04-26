import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProfessionalCard } from '../ProfessionalCard';
import { Professional } from '@/types';

const mockProfessional: Professional = {
  id: '1',
  name: 'Dr. João Silva',
  specialty: 'Psicólogo',
  rating: 4.5,
  reviewCount: 32,
  price: 150,
  image: 'https://example.com/image.jpg',
  location: {
    city: 'São Paulo',
    state: 'SP'
  }
};

const mockNavigation = {
  navigate: jest.fn()
};

describe('ProfessionalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente as informações do profissional', () => {
    const { getByText } = render(
      <ProfessionalCard professional={mockProfessional} navigation={mockNavigation} />
    );

    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Psicólogo')).toBeTruthy();
    expect(getByText('São Paulo, SP')).toBeTruthy();
    expect(getByText('R$ 150,00')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(32 avaliações)')).toBeTruthy();
  });

  it('navega para o perfil do profissional ao clicar no card', () => {
    const { getByTestId } = render(
      <ProfessionalCard professional={mockProfessional} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('professional-card'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfessionalProfile', {
      professionalId: '1'
    });
  });

  it('exibe placeholder quando não há imagem do profissional', () => {
    const professionalSemImagem = {
      ...mockProfessional,
      image: undefined
    };

    const { getByTestId } = render(
      <ProfessionalCard professional={professionalSemImagem} navigation={mockNavigation} />
    );

    expect(getByTestId('professional-avatar-placeholder')).toBeTruthy();
  });
}); 