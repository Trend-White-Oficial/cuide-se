import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReviewsScreen } from '../ReviewsScreen';
import { useNavigation } from '@react-navigation/native';
import { useReviews } from '@/hooks/useReviews';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useReviews', () => ({
  useReviews: jest.fn()
}));

describe('ReviewsScreen', () => {
  const mockReviews = [
    {
      id: '1',
      professionalId: '1',
      userId: '1',
      rating: 5,
      comment: 'Excelente profissional!',
      date: '2024-02-20T10:00:00Z',
      professional: {
        name: 'Dr. João Silva',
        specialty: 'Psicólogo',
        image: 'https://example.com/image.jpg'
      }
    },
    {
      id: '2',
      professionalId: '2',
      userId: '1',
      rating: 4,
      comment: 'Muito bom atendimento',
      date: '2024-02-21T14:00:00Z',
      professional: {
        name: 'Dra. Maria Santos',
        specialty: 'Nutricionista',
        image: 'https://example.com/image2.jpg'
      }
    }
  ];

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews: jest.fn(),
      updateReview: jest.fn(),
      deleteReview: jest.fn()
    });
  });

  it('renderiza corretamente a lista de avaliações', () => {
    const { getByText, getAllByTestId } = render(<ReviewsScreen />);

    expect(getByText('Minhas Avaliações')).toBeTruthy();
    expect(getAllByTestId('review-card')).toHaveLength(2);
    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Dra. Maria Santos')).toBeTruthy();
  });

  it('exibe os detalhes de cada avaliação', () => {
    const { getByText } = render(<ReviewsScreen />);

    expect(getByText('Excelente profissional!')).toBeTruthy();
    expect(getByText('Muito bom atendimento')).toBeTruthy();
    expect(getByText('5.0')).toBeTruthy();
    expect(getByText('4.0')).toBeTruthy();
  });

  it('permite editar uma avaliação', async () => {
    const updateReview = jest.fn().mockResolvedValue({ success: true });
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews: jest.fn(),
      updateReview,
      deleteReview: jest.fn()
    });

    const { getAllByTestId, getByTestId, getByText } = render(<ReviewsScreen />);

    fireEvent.press(getAllByTestId('edit-review-button')[0]);
    fireEvent.changeText(getByTestId('review-comment-input'), 'Profissional excelente!');
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(updateReview).toHaveBeenCalledWith('1', {
        rating: 5,
        comment: 'Profissional excelente!'
      });
    });
  });

  it('permite excluir uma avaliação', async () => {
    const deleteReview = jest.fn().mockResolvedValue({ success: true });
    const getReviews = jest.fn();
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews,
      updateReview: jest.fn(),
      deleteReview
    });

    const { getAllByTestId, getByText } = render(<ReviewsScreen />);

    fireEvent.press(getAllByTestId('delete-review-button')[0]);
    fireEvent.press(getByText('Confirmar'));

    await waitFor(() => {
      expect(deleteReview).toHaveBeenCalledWith('1');
      expect(getReviews).toHaveBeenCalled();
    });
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useReviews as jest.Mock).mockReturnValue({
      reviews: [],
      isLoading: true,
      error: null,
      getReviews: jest.fn(),
      updateReview: jest.fn(),
      deleteReview: jest.fn()
    });

    const { getByTestId } = render(<ReviewsScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar avaliações';
    (useReviews as jest.Mock).mockReturnValue({
      reviews: [],
      isLoading: false,
      error: errorMessage,
      getReviews: jest.fn(),
      updateReview: jest.fn(),
      deleteReview: jest.fn()
    });

    const { getByText } = render(<ReviewsScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('exibe mensagem quando não há avaliações', () => {
    (useReviews as jest.Mock).mockReturnValue({
      reviews: [],
      isLoading: false,
      error: null,
      getReviews: jest.fn(),
      updateReview: jest.fn(),
      deleteReview: jest.fn()
    });

    const { getByText } = render(<ReviewsScreen />);

    expect(getByText('Você ainda não fez nenhuma avaliação')).toBeTruthy();
  });

  it('carrega as avaliações ao montar o componente', async () => {
    const getReviews = jest.fn();
    (useReviews as jest.Mock).mockReturnValue({
      reviews: [],
      isLoading: false,
      error: null,
      getReviews,
      updateReview: jest.fn(),
      deleteReview: jest.fn()
    });

    render(<ReviewsScreen />);

    await waitFor(() => {
      expect(getReviews).toHaveBeenCalled();
    });
  });

  it('navega para o perfil do profissional ao clicar no card', () => {
    const { getAllByTestId } = render(<ReviewsScreen />);

    fireEvent.press(getAllByTestId('professional-card')[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfessionalProfile', {
      professionalId: '1'
    });
  });

  it('valida campos obrigatórios ao editar avaliação', async () => {
    const updateReview = jest.fn();
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews: jest.fn(),
      updateReview,
      deleteReview: jest.fn()
    });

    const { getAllByTestId, getByTestId, getByText } = render(<ReviewsScreen />);

    fireEvent.press(getAllByTestId('edit-review-button')[0]);
    fireEvent.changeText(getByTestId('review-comment-input'), '');
    fireEvent.press(getByText('Salvar'));

    expect(getByText('O comentário é obrigatório')).toBeTruthy();
    expect(updateReview).not.toHaveBeenCalled();
  });

  it('exibe confirmação antes de excluir avaliação', () => {
    const deleteReview = jest.fn();
    (useReviews as jest.Mock).mockReturnValue({
      reviews: mockReviews,
      isLoading: false,
      error: null,
      getReviews: jest.fn(),
      updateReview: jest.fn(),
      deleteReview
    });

    const { getAllByTestId, getByText, queryByText } = render(<ReviewsScreen />);

    fireEvent.press(getAllByTestId('delete-review-button')[0]);

    expect(getByText('Deseja realmente excluir esta avaliação?')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Confirmar')).toBeTruthy();

    fireEvent.press(getByText('Cancelar'));
    expect(queryByText('Deseja realmente excluir esta avaliação?')).toBeNull();
    expect(deleteReview).not.toHaveBeenCalled();
  });
}); 