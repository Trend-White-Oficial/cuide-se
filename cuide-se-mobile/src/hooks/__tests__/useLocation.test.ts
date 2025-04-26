import { renderHook, act } from '@testing-library/react';
import { useLocation } from '../useLocation';
import * as Location from 'expo-location';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do expo-location
vi.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: vi.fn(),
  getCurrentPositionAsync: vi.fn(),
  watchPositionAsync: vi.fn(),
}));

describe('useLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o estado padrão', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve solicitar permissão de localização com sucesso', async () => {
    (Location.requestForegroundPermissionsAsync as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 'granted',
    });

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro ao solicitar permissão de localização', async () => {
    (Location.requestForegroundPermissionsAsync as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 'denied',
    });

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(result.current.error).toBe('Permissão de localização negada');
  });

  it('deve obter a localização atual com sucesso', async () => {
    const mockLocation = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
        altitude: 0,
        accuracy: 5,
        altitudeAccuracy: 5,
        heading: 0,
        speed: 0,
      },
      timestamp: 1234567890,
    };
    (Location.getCurrentPositionAsync as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockLocation);

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.location).toEqual(mockLocation);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve lidar com erro ao obter a localização atual', async () => {
    (Location.getCurrentPositionAsync as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Erro ao obter localização'));

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe('Erro ao obter localização');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve iniciar o monitoramento de localização com sucesso', async () => {
    const mockLocation = {
      coords: {
        latitude: -23.5505,
        longitude: -46.6333,
        altitude: 0,
        accuracy: 5,
        altitudeAccuracy: 5,
        heading: 0,
        speed: 0,
      },
      timestamp: 1234567890,
    };
    (Location.watchPositionAsync as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      remove: vi.fn(),
      addListener: vi.fn(),
    });

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.startWatchingLocation();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve lidar com erro ao iniciar o monitoramento de localização', async () => {
    (Location.watchPositionAsync as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Erro ao iniciar monitoramento'));

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.startWatchingLocation();
    });

    expect(result.current.error).toBe('Erro ao iniciar monitoramento');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve parar o monitoramento de localização com sucesso', async () => {
    const mockRemove = vi.fn();
    (Location.watchPositionAsync as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      remove: mockRemove,
      addListener: vi.fn(),
    });

    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    await act(async () => {
      await result.current.startWatchingLocation();
      result.current.stopWatchingLocation();
    });

    expect(mockRemove).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('deve limpar o erro', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => children,
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
}); 