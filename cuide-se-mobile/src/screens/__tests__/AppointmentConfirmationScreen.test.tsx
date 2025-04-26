import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppointmentConfirmationScreen } from '../AppointmentConfirmationScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppointments } from '@/hooks/useAppointments';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn()
}));

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: jest.fn()
}));

describe('AppointmentConfirmationScreen', () => {
  const mockAppointment = {
    id: '1',
    professionalId: '1',
    serviceId: '1',
    date: '2024-02-20T10:00:00Z',
    status: 'scheduled',
    professional: {
      name: 'Dr. João Silva',
      specialty: 'Psicólogo'
    },
    service: {
      name: 'Consulta Psicológica',
      duration: 60,
      price: 150
    }
  };

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { appointmentId: '1' }
    });
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useAppointments as jest.Mock).mockReturnValue({
      appointment: mockAppointment,
      isLoading: false,
      error: null,
      getAppointmentById: jest.fn(),
      cancelAppointment: jest.fn()
    });
  });

  it('renderiza corretamente a tela de confirmação', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('Agendamento Confirmado')).toBeTruthy();
    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Psicólogo')).toBeTruthy();
    expect(getByText('Consulta Psicológica')).toBeTruthy();
    expect(getByText('20 de fevereiro de 2024')).toBeTruthy();
    expect(getByText('10:00')).toBeTruthy();
    expect(getByText('60 minutos')).toBeTruthy();
    expect(getByText('R$ 150,00')).toBeTruthy();
  });

  it('navega para a tela de agendamentos ao clicar em "Ver Meus Agendamentos"', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    fireEvent.press(getByText('Ver Meus Agendamentos'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Appointments');
  });

  it('navega para a tela inicial ao clicar em "Voltar para o Início"', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    fireEvent.press(getByText('Voltar para o Início'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      appointment: null,
      isLoading: true,
      error: null,
      getAppointmentById: jest.fn(),
      cancelAppointment: jest.fn()
    });

    const { getByTestId } = render(<AppointmentConfirmationScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar agendamento';
    (useAppointments as jest.Mock).mockReturnValue({
      appointment: null,
      isLoading: false,
      error: errorMessage,
      getAppointmentById: jest.fn(),
      cancelAppointment: jest.fn()
    });

    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('carrega os dados do agendamento ao montar o componente', async () => {
    const getAppointmentById = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      appointment: null,
      isLoading: false,
      error: null,
      getAppointmentById,
      cancelAppointment: jest.fn()
    });

    render(<AppointmentConfirmationScreen />);

    await waitFor(() => {
      expect(getAppointmentById).toHaveBeenCalledWith('1');
    });
  });

  it('exibe mensagem de erro ao tentar carregar um agendamento inexistente', async () => {
    const getAppointmentById = jest.fn().mockRejectedValue(new Error('Agendamento não encontrado'));
    (useAppointments as jest.Mock).mockReturnValue({
      appointment: null,
      isLoading: false,
      error: 'Agendamento não encontrado',
      getAppointmentById,
      cancelAppointment: jest.fn()
    });

    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('Agendamento não encontrado')).toBeTruthy();
  });

  it('formata corretamente a data do agendamento', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('20 de fevereiro de 2024')).toBeTruthy();
    expect(getByText('10:00')).toBeTruthy();
  });

  it('exibe o status do agendamento', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('Agendado')).toBeTruthy();
  });

  it('exibe os detalhes do serviço', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('Consulta Psicológica')).toBeTruthy();
    expect(getByText('60 minutos')).toBeTruthy();
    expect(getByText('R$ 150,00')).toBeTruthy();
  });

  it('exibe os detalhes do profissional', () => {
    const { getByText } = render(<AppointmentConfirmationScreen />);

    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Psicólogo')).toBeTruthy();
  });
}); 