import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useNavigation } from '@react-navigation/native';
import { useProfessionals } from '@/hooks/useProfessionals';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useProfessionals', () => ({
  useProfessionals: jest.fn()
}));

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };

  const mockProfessionals = [
    {
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
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useProfessionals as jest.Mock).mockReturnValue({
      professionals: mockProfessionals,
      isLoading: false,
      error: null,
      searchProfessionals: jest.fn()
    });
  });

  it('renderiza corretamente a tela inicial', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('Encontre o profissional ideal')).toBeTruthy();
    expect(getByTestId('search-bar')).toBeTruthy();
    expect(getByText('Profissionais em Destaque')).toBeTruthy();
    expect(getByText('Como Funciona')).toBeTruthy();
  });

  it('navega para a tela de busca ao clicar na barra de pesquisa', () => {
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('search-bar'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search');
  });

  it('exibe os profissionais em destaque', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Psicólogo')).toBeTruthy();
    expect(getByText('São Paulo, SP')).toBeTruthy();
  });

  it('navega para o perfil do profissional ao clicar no card', () => {
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('professional-card'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfessionalProfile', {
      professionalId: '1'
    });
  });

  it('exibe mensagem de carregamento quando isLoading é true', () => {
    (useProfessionals as jest.Mock).mockReturnValue({
      professionals: [],
      isLoading: true,
      error: null,
      searchProfessionals: jest.fn()
    });

    const { getByTestId } = render(<HomeScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar profissionais';
    (useProfessionals as jest.Mock).mockReturnValue({
      professionals: [],
      isLoading: false,
      error: errorMessage,
      searchProfessionals: jest.fn()
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('exibe seção "Como Funciona" com os passos corretos', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('1. Busque profissionais')).toBeTruthy();
    expect(getByText('2. Compare e escolha')).toBeTruthy();
    expect(getByText('3. Agende sua consulta')).toBeTruthy();
  });

  it('exibe botão de chamada para ação', () => {
    const { getByText } = render(<HomeScreen />);

    const ctaButton = getByText('Encontre seu profissional agora');
    expect(ctaButton).toBeTruthy();

    fireEvent.press(ctaButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Search');
  });
}); 