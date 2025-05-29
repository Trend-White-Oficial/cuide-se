import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { splitVendorChunkPlugin } from 'vite';
import { compression } from 'vite-plugin-compression2';

// Exporta a configuração do Vite
export default defineConfig({
  // Adiciona os plugins necessários
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
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
    // Habilita HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
    // Configurações de proxy
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Configurações de build
  build: {
    // Otimizações para o build
    minify: 'terser',
    // Caminho de saída do build
    outDir: 'dist',
    // Configurações de chunk
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
    // Configurações de terser
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Configurações de sourcemap
    sourcemap: false,
    // Configurações de assets
    assetsInlineLimit: 4096,
    // Configurações de CSS
    cssCodeSplit: true,
    // Configurações de chunk
    chunkSizeWarningLimit: 1000,
  },
  // Configurações de preview
  preview: {
    port: 8080,
    host: true,
  },
  // Configurações de teste
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts'],
    },
  },
});
