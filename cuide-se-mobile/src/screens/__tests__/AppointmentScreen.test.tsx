import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppointmentScreen } from '../AppointmentScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useServices } from '@/hooks/useServices';
import { useAppointments } from '@/hooks/useAppointments';

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

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: jest.fn()
}));

describe('AppointmentScreen', () => {
  const mockProfessional = {
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

  const mockService = {
    id: '1',
    name: 'Consulta Psicológica',
    description: 'Sessão de terapia individual',
    duration: 60,
    price: 150
  };

  const mockAvailableSlots = [
    {
      id: '1',
      startTime: '2024-02-20T10:00:00Z',
      endTime: '2024-02-20T11:00:00Z'
    },
    {
      id: '2',
      startTime: '2024-02-20T14:00:00Z',
      endTime: '2024-02-20T15:00:00Z'
    }
  ];

  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { 
        professionalId: '1',
        serviceId: '1'
      }
    });
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useProfessionals as jest.Mock).mockReturnValue({
      professional: mockProfessional,
      isLoading: false,
      error: null,
      getProfessionalById: jest.fn()
    });
    (useServices as jest.Mock).mockReturnValue({
      service: mockService,
      isLoading: false,
      error: null,
      getServiceById: jest.fn()
    });
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: mockAvailableSlots,
      isLoading: false,
      error: null,
      getAvailableSlots: jest.fn(),
      createAppointment: jest.fn()
    });
  });

  it('renderiza corretamente a tela de agendamento', () => {
    const { getByText, getByTestId } = render(<AppointmentScreen />);

    expect(getByText('Agendar Consulta')).toBeTruthy();
    expect(getByText('Dr. João Silva')).toBeTruthy();
    expect(getByText('Consulta Psicológica')).toBeTruthy();
    expect(getByText('60 minutos')).toBeTruthy();
    expect(getByText('R$ 150,00')).toBeTruthy();
    expect(getByTestId('calendar')).toBeTruthy();
  });

  it('exibe os horários disponíveis', () => {
    const { getByText } = render(<AppointmentScreen />);

    expect(getByText('10:00')).toBeTruthy();
    expect(getByText('14:00')).toBeTruthy();
  });

  it('permite selecionar um horário', () => {
    const { getByTestId } = render(<AppointmentScreen />);

    fireEvent.press(getByTestId('time-slot-1'));
    expect(getByTestId('time-slot-1')).toHaveStyle({ backgroundColor: '#E3F2FD' });
  });

  it('permite selecionar uma data no calendário', () => {
    const { getByTestId } = render(<AppointmentScreen />);

    fireEvent.press(getByTestId('calendar-day-2024-02-20'));
    expect(getByTestId('calendar-day-2024-02-20')).toHaveStyle({ backgroundColor: '#E3F2FD' });
  });

  it('cria um agendamento com sucesso', async () => {
    const createAppointment = jest.fn().mockResolvedValue({ success: true });
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: mockAvailableSlots,
      isLoading: false,
      error: null,
      getAvailableSlots: jest.fn(),
      createAppointment
    });

    const { getByTestId, getByText } = render(<AppointmentScreen />);

    fireEvent.press(getByTestId('calendar-day-2024-02-20'));
    fireEvent.press(getByTestId('time-slot-1'));
    fireEvent.press(getByText('Confirmar Agendamento'));

    await waitFor(() => {
      expect(createAppointment).toHaveBeenCalledWith({
        professionalId: '1',
        serviceId: '1',
        date: '2024-02-20T10:00:00Z'
      });
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AppointmentConfirmation', {
      appointmentId: expect.any(String)
    });
  });

  it('exibe indicador de carregamento quando isLoading é true', () => {
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: [],
      isLoading: true,
      error: null,
      getAvailableSlots: jest.fn(),
      createAppointment: jest.fn()
    });

    const { getByTestId } = render(<AppointmentScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('exibe mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar horários disponíveis';
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: [],
      isLoading: false,
      error: errorMessage,
      getAvailableSlots: jest.fn(),
      createAppointment: jest.fn()
    });

    const { getByText } = render(<AppointmentScreen />);

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('volta para a tela anterior ao pressionar o botão de voltar', () => {
    const { getByTestId } = render(<AppointmentScreen />);

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

    render(<AppointmentScreen />);

    await waitFor(() => {
      expect(getProfessionalById).toHaveBeenCalledWith('1');
    });
  });

  it('carrega os dados do serviço ao montar o componente', async () => {
    const getServiceById = jest.fn();
    (useServices as jest.Mock).mockReturnValue({
      service: null,
      isLoading: false,
      error: null,
      getServiceById
    });

    render(<AppointmentScreen />);

    await waitFor(() => {
      expect(getServiceById).toHaveBeenCalledWith('1', '1');
    });
  });

  it('carrega os horários disponíveis ao montar o componente', async () => {
    const getAvailableSlots = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: [],
      isLoading: false,
      error: null,
      getAvailableSlots,
      createAppointment: jest.fn()
    });

    render(<AppointmentScreen />);

    await waitFor(() => {
      expect(getAvailableSlots).toHaveBeenCalledWith('1', '1');
    });
  });

  it('atualiza os horários disponíveis ao selecionar uma nova data', async () => {
    const getAvailableSlots = jest.fn();
    (useAppointments as jest.Mock).mockReturnValue({
      availableSlots: [],
      isLoading: false,
      error: null,
      getAvailableSlots,
      createAppointment: jest.fn()
    });

    const { getByTestId } = render(<AppointmentScreen />);

    fireEvent.press(getByTestId('calendar-day-2024-02-21'));

    await waitFor(() => {
      expect(getAvailableSlots).toHaveBeenCalledWith('1', '1', '2024-02-21');
    });
  });
}); 