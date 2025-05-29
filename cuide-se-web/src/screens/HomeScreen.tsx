import React from 'react';

export default function HomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-md">
      <h1 className="text-center mb-lg">Bem-vindo ao Cuide-se</h1>
      <p className="text-center mb-lg">
        Sua plataforma de cuidados pessoais
      </p>
      <div className="flex gap-md">
        <button className="btn btn-primary">
          Começar Agora
        </button>
        <button className="btn btn-secondary">
          Saiba Mais
        </button>
      </div>
    </div>
  );
}
