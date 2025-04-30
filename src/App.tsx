// Componente principal da aplicação
// Este arquivo configura a estrutura básica da aplicação e as rotas principais
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  // Renderiza a aplicação com:
  // 1. AuthProvider - Gerencia o estado de autenticação
  // 2. Router - Gerencia a navegação da aplicação
  // 3. Rotas principais:
  //    - / - Página inicial (Home)
  //    - /about - Página sobre
  //    - * - Página de erro 404 (NotFound)
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
