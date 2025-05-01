<<<<<<< HEAD
=======
// Componente principal da aplicação
// Este arquivo configura a estrutura básica da aplicação e as rotas principais
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

<<<<<<< HEAD
// Este arquivo App.tsx está configurado para o ambiente web.
export default function App() {
=======
export default function App() {
  // Renderiza a aplicação com:
  // 1. AuthProvider - Gerencia o estado de autenticação
  // 2. Router - Gerencia a navegação da aplicação
  // 3. Rotas principais:
  //    - / - Página inicial (Home)
  //    - /about - Página sobre
  //    - * - Página de erro 404 (NotFound)
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
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
