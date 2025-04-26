import { appointmentsService } from '../api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AppointmentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppointments', () => {
    it('deve buscar agendamentos com sucesso', async () => {
      const mockAppointments = [
        {
          id: '1',
          professionalId: '1',
          userId: '1',
          date: '2024-02-20T10:00:00Z',
          status: 'scheduled',
          serviceId: '1'
        },
        {
          id: '2',
          professionalId: '2',
          userId: '1',
          date: '2024-02-21T14:00:00Z',
          status: 'completed',
          serviceId: '2'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockAppointments });

      const response = await appointmentsService.getAppointments();

      expect(response.data).toEqual(mockAppointments);
      expect(mockedAxios.get).toHaveBeenCalledWith('/appointments');
    });

    it('deve lidar com erro na busca de agendamentos', async () => {
      const errorMessage = 'Erro ao buscar agendamentos';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(appointmentsService.getAppointments())
        .rejects.toThrow(errorMessage);
    });
  });

  describe('createAppointment', () => {
    it('deve criar um agendamento com sucesso', async () => {
      const mockAppointment = {
        id: '1',
        professionalId: '1',
        userId: '1',
        date: '2024-02-20T10:00:00Z',
        status: 'scheduled',
        serviceId: '1'
      };

      const appointmentData = {
        professionalId: '1',
        date: '2024-02-20T10:00:00Z',
        serviceId: '1'
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockAppointment });

      const response = await appointmentsService.createAppointment(appointmentData);

      expect(response.data).toEqual(mockAppointment);
      expect(mockedAxios.post).toHaveBeenCalledWith('/appointments', appointmentData);
    });

    it('deve lidar com erro na criação de agendamento', async () => {
      const errorMessage = 'Erro ao criar agendamento';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      const appointmentData = {
        professionalId: '1',
        date: '2024-02-20T10:00:00Z',
        serviceId: '1'
      };

      await expect(appointmentsService.createAppointment(appointmentData))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('cancelAppointment', () => {
    it('deve cancelar um agendamento com sucesso', async () => {
      const mockResponse = { data: { message: 'Agendamento cancelado com sucesso' } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const response = await appointmentsService.cancelAppointment('1');

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.patch).toHaveBeenCalledWith('/appointments/1/cancel');
    });

    it('deve lidar com erro no cancelamento de agendamento', async () => {
      const errorMessage = 'Erro ao cancelar agendamento';
      mockedAxios.patch.mockRejectedValueOnce(new Error(errorMessage));

      await expect(appointmentsService.cancelAppointment('1'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('rescheduleAppointment', () => {
    it('deve reagendar um agendamento com sucesso', async () => {
      const mockAppointment = {
        id: '1',
        professionalId: '1',
        userId: '1',
        date: '2024-02-21T10:00:00Z',
        status: 'scheduled',
        serviceId: '1'
      };

      mockedAxios.patch.mockResolvedValueOnce({ data: mockAppointment });

      const newDate = '2024-02-21T10:00:00Z';
      const response = await appointmentsService.rescheduleAppointment('1', newDate);

      expect(response.data).toEqual(mockAppointment);
      expect(mockedAxios.patch).toHaveBeenCalledWith('/appointments/1/reschedule', { date: newDate });
    });

    it('deve lidar com erro no reagendamento', async () => {
      const errorMessage = 'Erro ao reagendar';
      mockedAxios.patch.mockRejectedValueOnce(new Error(errorMessage));

      const newDate = '2024-02-21T10:00:00Z';
      await expect(appointmentsService.rescheduleAppointment('1', newDate))
        .rejects.toThrow(errorMessage);
    });
  });
}); 