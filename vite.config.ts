// Configuração do Vite para o projeto Cuide-Se.
// Inclui suporte para TypeScript, React e integração com Tailwind CSS.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Plugins utilizados no projeto
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "src") } // Atalho para o diretório src
    ]
  },
  server: {
    port: 5173, // Porta padrão do servidor de desenvolvimento
    host: true, // Permite que o servidor seja acessado externamente
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000', // URL alvo para o proxy
        changeOrigin: true, // Altera a origem do host no cabeçalho
        rewrite: (path) => path.replace(/^\/api/, '') // Reescreve o caminho da API
      }
    }
  },
  build: {
    outDir: 'dist', // Diretório de saída para o build
    sourcemap: true, // Gera mapas de origem para depuração
    minify: 'terser', // Minificação utilizando Terser
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production' // Remove console.logs em produção
      }
    }
  },
  optimizeDeps: {
    include: [
      "react", // Biblioteca React
      "react-dom", // Biblioteca React DOM
      "react-router-dom", // Biblioteca para roteamento
      "@tanstack/react-query", // Biblioteca para gerenciamento de estado assíncrono
      "@radix-ui/react-tooltip", // Componente de tooltip
      "clsx", // Utilitário para manipulação de classes CSS
      "tailwind-merge", // Utilitário para mesclar classes Tailwind CSS
      "date-fns", // Biblioteca para manipulação de datas
      "lucide-react", // Biblioteca de ícones
      "react-hook-form", // Biblioteca para formulários
      "zod", // Biblioteca para validação de dados
      "@hookform/resolvers/zod" // Resolvedor para integração entre react-hook-form e zod
    ]
  }
});
