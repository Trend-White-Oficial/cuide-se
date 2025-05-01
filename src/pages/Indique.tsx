import React, { useState } from 'react';

const Indique = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar o e-mail de indicação
    alert(`E-mail de indicação enviado para: ${email}`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-pink mb-6">Indique sua amiga</h1>
      <p className="text-gray-600 mb-8">
        Compartilhe o Cuide-Se com suas amigas e ganhe benefícios exclusivos!
      </p>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            E-mail da sua amiga
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-pink text-white px-6 py-2 rounded-md hover:bg-pink/80 transition"
        >
          Enviar Indicação
        </button>
      </form>
    </div>
  );
};

export default Indique; 