// Configuração inicial para os testes do projeto Cuide-Se.
// Inclui mocks globais e limpeza do DOM após cada teste.

import '@testing-library/jest-dom'; // Extensões para asserções do Jest
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { vi } from 'vitest';

// Limpa o DOM após cada teste para evitar interferências
afterEach(() => {
  cleanup();
});

// Mock do localStorage para testes
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do matchMedia para testes de responsividade
Object.defineProperty(window, 'matchMedia', {
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

// Mock do IntersectionObserver para testes de elementos visíveis
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock do ResizeObserver para testes de redimensionamento
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.ResizeObserver = mockResizeObserver;