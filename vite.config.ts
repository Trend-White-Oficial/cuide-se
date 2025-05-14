
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Exporta a configuração do Vite
export default defineConfig({
  // Adiciona o plugin do React
  plugins: [react()],
  // Configurações de resolução de caminhos
  resolve: {
    alias: {
      // Define o alias '@' para apontar para a pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configurações do servidor de desenvolvimento
  server: {
    // Porta do servidor de desenvolvimento
    port: 8080,
    // Permite acesso externo ao servidor
    host: true,
  },
  // Configurações de build
  build: {
    // Otimizações para o build
    minify: 'terser',
    // Caminho de saída do build
    outDir: 'dist',
  },
});
