import { renderHook, act } from '@testing-library/react-hooks';
import { useAppointments } from '../useAppointments';
import { useAuth } from '../useAuth';
import { useToast } from '../useToast';
import { useLoading } from '../useLoading';

// Mock dos hooks
jest.mock('../useAuth');
jest.mock('../useToast');
jest.mock('../useLoading');

describe('useAppointments', () => {
  const mockUser = { id: '1', name: 'Test User' };
  const mockShowToast = jest.fn();
  const mockShowLoading = jest.fn();
  const mockHideLoading = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
    (useLoading as jest.Mock).mockReturnValue({
      showLoading: mockShowLoading,
      hideLoading: mockHideLoading,
    });
  });

  it('should initialize with empty appointments', () => {
    const { result } = renderHook(() => useAppointments());

    expect(result.current.appointments).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch appointments successfully', async () => {
    const mockAppointments = [
      {
        id: '1',
        serviceId: '1',
        serviceName: 'Corte de Cabelo',
        professionalId: '1',
        professionalName: 'João Silva',
        date: new Date('2024-03-20T10:00:00'),
        status: 'scheduled',
        price: 50,
      },
    ];

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockAppointments),
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.fetchAppointments();
    });

    expect(result.current.appointments).toEqual(mockAppointments);
    expect(mockShowLoading).toHaveBeenCalled();
    expect(mockHideLoading).toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.fetchAppointments();
    });

    expect(result.current.error).toBe('Erro ao carregar agendamentos');
    expect(mockShowToast).toHaveBeenCalledWith(
      'Erro ao carregar agendamentos',
      'error'
    );
  });

  it('should create appointment successfully', async () => {
    const mockAppointment = {
      serviceId: '1',
      serviceName: 'Corte de Cabelo',
      professionalId: '1',
      professionalName: 'João Silva',
      date: new Date('2024-03-20T10:00:00'),
      status: 'scheduled',
      price: 50,
    };

    const mockCreatedAppointment = {
      id: '1',
      ...mockAppointment,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockCreatedAppointment),
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.createAppointment(mockAppointment);
    });

    expect(result.current.appointments).toContainEqual(mockCreatedAppointment);
    expect(mockShowToast).toHaveBeenCalledWith(
      'Agendamento criado com sucesso',
      'success'
    );
  });

  it('should update appointment successfully', async () => {
    const mockAppointment = {
      id: '1',
      serviceId: '1',
      serviceName: 'Corte de Cabelo',
      professionalId: '1',
      professionalName: 'João Silva',
      date: new Date('2024-03-20T10:00:00'),
      status: 'scheduled',
      price: 50,
    };

    const mockUpdatedAppointment = {
      ...mockAppointment,
      price: 60,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockUpdatedAppointment),
    });

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.updateAppointment('1', { price: 60 });
    });

    expect(result.current.appointments).toContainEqual(mockUpdatedAppointment);
    expect(mockShowToast).toHaveBeenCalledWith(
      'Agendamento atualizado com sucesso',
      'success'
    );
  });

  it('should cancel appointment successfully', async () => {
    const mockAppointment = {
      id: '1',
      serviceId: '1',
      serviceName: 'Corte de Cabelo',
      professionalId: '1',
      professionalName: 'João Silva',
      date: new Date('2024-03-20T10:00:00'),
      status: 'scheduled',
      price: 50,
    };

    global.fetch = jest.fn().mockResolvedValueOnce({});

    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.cancelAppointment('1');
    });

    expect(result.current.appointments).toContainEqual({
      ...mockAppointment,
      status: 'cancelled',
    });
    expect(mockShowToast).toHaveBeenCalledWith(
      'Agendamento cancelado com sucesso',
      'success'
    );
  });

  it('should get appointment by id', () => {
    const mockAppointment = {
      id: '1',
      serviceId: '1',
      serviceName: 'Corte de Cabelo',
      professionalId: '1',
      professionalName: 'João Silva',
      date: new Date('2024-03-20T10:00:00'),
      status: 'scheduled',
      price: 50,
    };

    const { result } = renderHook(() => useAppointments());

    act(() => {
      result.current.appointments = [mockAppointment];
    });

    expect(result.current.getAppointmentById('1')).toEqual(mockAppointment);
  });

  it('should get upcoming appointments', () => {
    const mockAppointments = [
      {
        id: '1',
        serviceId: '1',
        serviceName: 'Corte de Cabelo',
        professionalId: '1',
        professionalName: 'João Silva',
        date: new Date('2024-03-20T10:00:00'),
        status: 'scheduled',
        price: 50,
      },
      {
        id: '2',
        serviceId: '2',
        serviceName: 'Barba',
        professionalId: '1',
        professionalName: 'João Silva',
        date: new Date('2024-03-19T10:00:00'),
        status: 'completed',
        price: 30,
      },
    ];

    const { result } = renderHook(() => useAppointments());

    act(() => {
      result.current.appointments = mockAppointments;
    });

    expect(result.current.getUpcomingAppointments()).toEqual([mockAppointments[0]]);
  });

  it('should get past appointments', () => {
    const mockAppointments = [
      {
        id: '1',
        serviceId: '1',
        serviceName: 'Corte de Cabelo',
        professionalId: '1',
        professionalName: 'João Silva',
        date: new Date('2024-03-20T10:00:00'),
        status: 'scheduled',
        price: 50,
      },
      {
        id: '2',
        serviceId: '2',
        serviceName: 'Barba',
        professionalId: '1',
        professionalName: 'João Silva',
        date: new Date('2024-03-19T10:00:00'),
        status: 'completed',
        price: 30,
      },
    ];

    const { result } = renderHook(() => useAppointments());

    act(() => {
      result.current.appointments = mockAppointments;
    });

    expect(result.current.getPastAppointments()).toEqual([mockAppointments[1]]);
  });
}); 