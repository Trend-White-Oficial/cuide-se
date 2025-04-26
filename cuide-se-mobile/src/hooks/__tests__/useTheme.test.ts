import { renderHook, act } from '@testing-library/react-native';
import { useTheme } from '../useTheme';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com o tema padrão', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve carregar o tema salvo do AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('dark');

    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.loadTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve alternar entre temas light e dark', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'dark');

    await act(async () => {
      await result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'light');
  });

  it('deve definir um tema específico', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'dark');
  });

  it('deve lidar com erro ao carregar o tema', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Erro ao carregar tema'));

    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.loadTheme();
    });

    expect(result.current.theme).toBe('light'); // Mantém o tema padrão
    expect(result.current.isLoading).toBe(false);
  });

  it('deve lidar com erro ao salvar o tema', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Erro ao salvar tema'));

    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark'); // O tema é atualizado mesmo com erro ao salvar
    expect(result.current.isLoading).toBe(false);
  });
}); 