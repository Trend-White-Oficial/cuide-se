import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { vi } from 'vitest';

// Declaração do objeto window para testes
declare global {
  interface Window {
    localStorage: Storage;
    matchMedia: (query: string) => MediaQueryList;
    IntersectionObserver: typeof IntersectionObserver;
    ResizeObserver: typeof ResizeObserver;
  }
}

const globalWindow = global.window as Window & typeof globalThis;

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(globalWindow, 'localStorage', { value: localStorageMock });

// Mock do matchMedia
Object.defineProperty(globalWindow, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
globalWindow.IntersectionObserver = mockIntersectionObserver;

// Mock do ResizeObserver
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
globalWindow.ResizeObserver = mockResizeObserver;

// Mock do console.error para não poluir os logs de teste
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock do AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
    multiGet: vi.fn(),
    multiSet: vi.fn(),
    multiRemove: vi.fn(),
  },
})); 