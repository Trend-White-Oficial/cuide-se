
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Define os arquivos que o Tailwind deve analisar
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Cores personalizadas
      colors: {
        pink: '#FF69B4',
        background: '#f8f9fa',
      },
      // Fontes personalizadas
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  // Plugins do Tailwind
  plugins: [],
}
