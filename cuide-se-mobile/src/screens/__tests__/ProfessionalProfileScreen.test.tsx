import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfessionalProfileScreen } from '../ProfessionalProfileScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useServices } from '@/hooks/useServices';
import { useReviews } from '@/hooks/useReviews';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useProfessionals', () => ({
  useProfessionals: jest.fn()
}));

jest.mock('@/hooks/useServices', () => ({
  useServices: jest.fn()
}));

jest.mock('@/hooks/useReviews', () => ({
  useReviews: jest.fn()
}));

describe('ProfessionalProfileScreen', () => {
  const mockProfessional = {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Psicólogo',
    rating: 4.5,
    reviewCount: 32,
    price: 150,
    image: 'https://example.com/image.jpg',
    bio: 'Psicólogo clínico com 10 anos de experiência',
    location: {
      city: 'São Paulo',
      state: 'SP'
    }
  };

  const mockServices = [
    {
      id: '1',
      name: 'Consulta Psicológica',
      description: 'Sessão de terapia individual',
      duration: 60,
      price: 150
    }
  ];

  const mockReviews = [
    {
      id: '1',
      userId: '1',
      userName: 'Maria Santos',
      rating: 5,
      comment: 'Excelente profissional!',
      date: '2024-02-20T10:00:00Z'
    }
  ];

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { professionalId: '1' }
    });
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useProfessionals as jest.Mock).mockReturnValue({
      professional: mockProfessional,
      isLoading: false,
      error: null,
      getProfessionalById: jest.fn()
    });
    (useServices as jest.Mock).mockReturnValue({
      services: mockServices,
      isLoading: false,
      error: null,
      getServices: jest.fn()
    });
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews: jest.fn()
    });
  });

  it('renderiza corretamente o perfil do profissional', () => {
    const { getByText, getByTestId } = render(<ProfessionalProfileScreen />);

    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Psicólogo')).toBeTruthy();
    expect(getByText('São Paulo, SP')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('(32 avaliações)')).toBeTruthy();
    expect(getByText('Psicólogo clínico com 10 anos de experiência')).toBeTruthy();
    expect(getByTestId('professional-image')).toBeTruthy();
  });

  it('exibe os serviços do profissional', () => {
    const { getByText } = render(<ProfessionalProfileScreen />);

    expect(getByText('Consulta Psicológica')).toBeTruthy();
    expect(getByText('Sessão de terapia individual')).toBeTruthy();
    expect(getByText('60 minutos')).toBeTruthy();
    expect(getByText('R$ 150,00')).toBeTruthy();
  });

  it('exibe as avaliações do profissional', () => {
    const { getByText } = render(<ProfessionalProfileScreen />);

    expect(getByText('Maria Santos')).toBeTruthy();
    expect(getByText('Excelente profissional!')).toBeTruthy();
    expect(getByText('5.0')).toBeTruthy();
  });

  it('navega para a tela de agendamento ao clicar em um serviço', () => {
    const { getByTestId } = render(<ProfessionalProfileScreen />);

    fireEvent.press(getByTestId('service-card-1'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Appointment', {
      professionalId: '1',
      serviceId: '1'
    });
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useProfessionals as jest.Mock).mockReturnValue({
      professional: null,
      isLoading: true,
      error: null,
      getProfessionalById: jest.fn()
    });

    const { getByTestId } = render(<ProfessionalProfileScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar perfil do profissional';
    (useProfessionals as jest.Mock).mockReturnValue({
      professional: null,
      isLoading: false,
      error: errorMessage,
      getProfessionalById: jest.fn()
    });

    const { getByText } = render(<ProfessionalProfileScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('volta para a tela anterior ao pressionar o botão de voltar', () => {
    const { getByTestId } = render(<ProfessionalProfileScreen />);

    fireEvent.press(getByTestId('back-button'));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('carrega os dados do profissional ao montar o componente', async () => {
    const getProfessionalById = jest.fn();
    (useProfessionals as jest.Mock).mockReturnValue({
      professional: null,
      isLoading: false,
      error: null,
      getProfessionalById
    });

    render(<ProfessionalProfileScreen />);

    await waitFor(() => {
      expect(getProfessionalById).toHaveBeenCalledWith('1');
    });
  });

  it('carrega os serviços do profissional ao montar o componente', async () => {
    const getServices = jest.fn();
    (useServices as jest.Mock).mockReturnValue({
      services: [],
      isLoading: false,
      error: null,
      getServices
    });

    render(<ProfessionalProfileScreen />);

    await waitFor(() => {
      expect(getServices).toHaveBeenCalledWith('1');
    });
  });

  it('carrega as avaliações do profissional ao montar o componente', async () => {
    const getReviews = jest.fn();
    (useReviews as jest.Mock).mockReturnValue({
      reviews: [],
      isLoading: false,
      error: null,
      getReviews
    });

    render(<ProfessionalProfileScreen />);

    await waitFor(() => {
      expect(getReviews).toHaveBeenCalledWith('1');
    });
  });
}); 