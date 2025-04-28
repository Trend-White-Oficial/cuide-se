import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppointmentsScreen } from '../AppointmentsScreen';
import { useNavigation } from '@react-navigation/native';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: jest.fn()
}));

describe('AppointmentsScreen', () => {
  const mockAppointments = [
    {
      id: '1',
      professionalId: '1',
      userId: '1',
      date: new Date('2024-03-20T10:00:00'),
      status: 'scheduled',
      professional: {
        id: '1',
        name: 'Dr. Silva',
        specialty: 'Psicólogo',
        image: 'https://example.com/image.jpg'
      }
    },
    {
      id: '2',
      professionalId: '2',
      userId: '1',
      date: new Date('2024-03-21T14:30:00'),
      status: 'completed',
      professional: {
        id: '2',
        name: 'Dra. Santos',
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
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      isLoading: false,
      error: null,
      cancelAppointment: jest.fn(),
      rescheduleAppointment: jest.fn()
    });
  });

  it('renderiza corretamente a lista de agendamentos', () => {
    const { getByText, getAllByTestId } = render(<AppointmentsScreen />);

    expect(getByText('Meus Agendamentos')).toBeTruthy();
    expect(getAllByTestId('appointment-card')).toHaveLength(2);
    expect(getByText('Dr. Silva')).toBeTruthy();
    expect(getByText('Dra. Santos')).toBeTruthy();
  });

  it('exibe data e hora formatadas corretamente', () => {
    const { getByText } = render(<AppointmentsScreen />);

    const formattedDate1 = format(mockAppointments[0].date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    const formattedDate2 = format(mockAppointments[1].date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

    expect(getByText(formattedDate1)).toBeTruthy();
    expect(getByText(formattedDate2)).toBeTruthy();
  });

  it('permite cancelar um agendamento', async () => {
    const cancelAppointment = jest.fn().mockResolvedValue({ success: true });
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      isLoading: false,
      error: null,
      cancelAppointment
    });

    const { getAllByTestId, getByText } = render(<AppointmentsScreen />);

    fireEvent.press(getAllByTestId('cancel-button')[0]);

    expect(getByText('Deseja cancelar este agendamento?')).toBeTruthy();
    fireEvent.press(getByText('Confirmar'));

    await waitFor(() => {
      expect(cancelAppointment).toHaveBeenCalledWith('1');
    });
  });

  it('permite reagendar um agendamento', async () => {
    const rescheduleAppointment = jest.fn().mockResolvedValue({ success: true });
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      isLoading: false,
      error: null,
      rescheduleAppointment
    });

    const { getAllByTestId } = render(<AppointmentsScreen />);

    fireEvent.press(getAllByTestId('reschedule-button')[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RescheduleAppointment', {
      appointmentId: '1'
    });
  });

  it('navega para detalhes do profissional ao clicar no card', () => {
    const { getAllByTestId } = render(<AppointmentsScreen />);

    fireEvent.press(getAllByTestId('professional-info')[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProfessionalProfile', {
      professionalId: '1'
    });
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      isLoading: true,
      error: null
    });

    const { getByTestId } = render(<AppointmentsScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar agendamentos';
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      isLoading: false,
      error: errorMessage
    });

    const { getByText } = render(<AppointmentsScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('exibe mensagem quando não há agendamentos', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: [],
      isLoading: false,
      error: null
    });

    const { getByText } = render(<AppointmentsScreen />);

    expect(getByText('Você não possui agendamentos')).toBeTruthy();
  });

  it('filtra agendamentos por status', () => {
    const { getByTestId, getAllByTestId } = render(<AppointmentsScreen />);

    fireEvent.press(getByTestId('filter-completed'));
    expect(getAllByTestId('appointment-card')).toHaveLength(1);
    expect(getAllByTestId('appointment-status')[0].props.children).toBe('Concluído');

    fireEvent.press(getByTestId('filter-scheduled'));
    expect(getAllByTestId('appointment-card')).toHaveLength(1);
    expect(getAllByTestId('appointment-status')[0].props.children).toBe('Agendado');
  });

  it('atualiza a lista ao fazer pull-to-refresh', async () => {
    const getAppointments = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      appointments: mockAppointments,
      isLoading: false,
      error: null,
      getAppointments
    });

    const { getByTestId } = render(<AppointmentsScreen />);

    fireEvent.scroll(getByTestId('appointments-list'), {
      nativeEvent: {
        contentOffset: { y: 0 },
        contentSize: { height: 500, width: 100 },
        layoutMeasurement: { height: 100, width: 100 }
      }
    });

    await waitFor(() => {
      expect(getAppointments).toHaveBeenCalled();
    });
  });

  it('permite avaliar um agendamento concluído', () => {
    const { getAllByTestId } = render(<AppointmentsScreen />);

    fireEvent.press(getAllByTestId('review-button')[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ReviewForm', {
      appointmentId: '2',
      professionalId: '2'
    });
  });
}); 