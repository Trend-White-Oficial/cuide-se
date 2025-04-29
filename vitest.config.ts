// Configuração do Vitest para o projeto Cuide-Se.
// Inclui suporte para testes unitários e integração com TypeScript.

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Habilita variáveis globais para os testes
    environment: 'jsdom', // Define o ambiente de teste como JSDOM
    setupFiles: ['./src/test/setup.ts'], // Arquivo de configuração inicial para os testes
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'istanbul', // Provedor de cobertura de código
      reporter: ['text', 'json', 'html'], // Formatos de relatório de cobertura
      exclude: [
        'node_modules/**',
        'src/test/**',
      ],
      reportsDirectory: './coverage', // Diretório para os relatórios de cobertura
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});