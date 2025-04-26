import { renderHook, act } from '@testing-library/react';
import { useAppointments } from '../useAppointments';
import { appointmentsService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do appointmentsService
vi.mock('@/services/api', () => ({
  appointmentsService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    cancel: vi.fn(),
  },
}));

describe('useAppointments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.appointments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar agendamentos com sucesso', async () => {
    const mockAppointments = [
      { id: 1, date: '2023-01-01', service: 'Corte de Cabelo' },
      { id: 2, date: '2023-01-02', service: 'Manicure' },
    ];
    (appointmentsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockAppointments,
    });

    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchAppointments();
    });

    expect(result.current.appointments).toEqual(mockAppointments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao buscar agendamentos', async () => {
    const errorMessage = 'Erro ao buscar agendamentos';
    (appointmentsService.getAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchAppointments();
    });

    expect(result.current.appointments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve criar um agendamento com sucesso', async () => {
    const mockAppointment = { id: 1, date: '2023-01-01', service: 'Corte de Cabelo' };
    (appointmentsService.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockAppointment,
    });

    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.createAppointment({
        professionalId: 1,
        serviceId: 1,
        date: '2023-01-01',
        time: '10:00',
      });
    });

    expect(result.current.appointments).toContainEqual(mockAppointment);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve cancelar um agendamento com sucesso', async () => {
    const mockAppointments = [
      { id: 1, date: '2023-01-01', service: 'Corte de Cabelo', status: 'scheduled' },
      { id: 2, date: '2023-01-02', service: 'Manicure', status: 'scheduled' },
    ];
    (appointmentsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockAppointments,
    });
    (appointmentsService.cancel as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { ...mockAppointments[0], status: 'cancelled' },
    });

    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchAppointments();
      await result.current.cancelAppointment(1);
    });

    expect(result.current.appointments.find(a => a.id === 1)?.status).toBe('cancelled');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 