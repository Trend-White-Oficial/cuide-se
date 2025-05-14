
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Renderiza o componente App no elemento com id 'root'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
