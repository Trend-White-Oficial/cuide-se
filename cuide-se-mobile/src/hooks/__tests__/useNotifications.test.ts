import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '../useNotifications';
import { notificationsService } from '@/services/api';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do notificationsService
vi.mock('@/services/api', () => ({
  notificationsService: {
    getAll: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve buscar notificações com sucesso', async () => {
    const mockNotifications = [
      { id: 1, title: 'Novo agendamento', read: false },
      { id: 2, title: 'Lembrete', read: true },
    ];
    (notificationsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockNotifications,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchNotifications();
    });

    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao buscar notificações', async () => {
    const errorMessage = 'Erro ao buscar notificações';
    (notificationsService.getAll as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchNotifications();
    });

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deve marcar uma notificação como lida com sucesso', async () => {
    const mockNotifications = [
      { id: 1, title: 'Novo agendamento', read: false },
      { id: 2, title: 'Lembrete', read: true },
    ];
    (notificationsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockNotifications,
    });
    (notificationsService.markAsRead as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { ...mockNotifications[0], read: true },
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchNotifications();
      await result.current.markAsRead(1);
    });

    expect(result.current.notifications.find(n => n.id === 1)?.read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve marcar todas as notificações como lidas com sucesso', async () => {
    const mockNotifications = [
      { id: 1, title: 'Novo agendamento', read: false },
      { id: 2, title: 'Lembrete', read: false },
    ];
    (notificationsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockNotifications,
    });
    (notificationsService.markAllAsRead as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockNotifications.map(n => ({ ...n, read: true })),
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchNotifications();
      await result.current.markAllAsRead();
    });

    expect(result.current.notifications.every(n => n.read)).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve excluir uma notificação com sucesso', async () => {
    const mockNotifications = [
      { id: 1, title: 'Novo agendamento', read: false },
      { id: 2, title: 'Lembrete', read: true },
    ];
    (notificationsService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockNotifications,
    });
    (notificationsService.delete as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.fetchNotifications();
      await result.current.deleteNotification(1);
    });

    expect(result.current.notifications.find(n => n.id === 1)).toBeUndefined();
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 