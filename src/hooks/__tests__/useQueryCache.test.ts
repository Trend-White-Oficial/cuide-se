import { renderHook, act } from '@testing-library/react';
import { useQueryCache } from '../useQueryCache';

describe('useQueryCache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com cache vazio', () => {
    const { result } = renderHook(() => useQueryCache());

    expect(result.current.getCachedData('test-key')).toBeNull();
  });

  it('deve salvar e recuperar dados do cache', () => {
    const { result } = renderHook(() => useQueryCache());
    const testData = { id: 1, name: 'Test' };

    act(() => {
      result.current.setCachedData('test-key', testData);
    });

    expect(result.current.getCachedData('test-key')).toEqual(testData);
  });

  it('deve limpar o cache', () => {
    const { result } = renderHook(() => useQueryCache());
    const testData = { id: 1, name: 'Test' };

    act(() => {
      result.current.setCachedData('test-key', testData);
      result.current.clearCache();
    });

    expect(result.current.getCachedData('test-key')).toBeNull();
  });

  it('deve verificar se o cache está expirado', () => {
    const { result } = renderHook(() => useQueryCache());
    const testData = { id: 1, name: 'Test' };

    act(() => {
      result.current.setCachedData('test-key', testData, 0); // TTL de 0 para expirar imediatamente
    });

    expect(result.current.getCachedData('test-key')).toBeNull();
  });

  it('deve manter o cache válido dentro do TTL', () => {
    const { result } = renderHook(() => useQueryCache());
    const testData = { id: 1, name: 'Test' };

    act(() => {
      result.current.setCachedData('test-key', testData, 3600); // TTL de 1 hora
    });

    expect(result.current.getCachedData('test-key')).toEqual(testData);
  });
}); 