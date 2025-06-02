export const accessibilityConfig = {
  // Cores e contraste
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    text: '#212121',
    background: '#FFFFFF',
    error: '#D32F2F',
    success: '#388E3C'
  },

  // Tamanhos de fonte
  typography: {
    baseSize: '16px',
    scale: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem'
    }
  },

  // Espaçamento
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
    xlarge: '2rem'
  },

  // Breakpoints para responsividade
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  },

  // Configurações de foco
  focus: {
    outline: '2px solid #4CAF50',
    outlineOffset: '2px'
  },

  // Configurações de animação
  animation: {
    duration: '0.3s',
    timing: 'ease-in-out'
  }
};

// Funções auxiliares para acessibilidade
export const accessibilityHelpers = {
  // Verifica contraste de cores
  checkContrast: (foreground, background) => {
    // Implementação do cálculo de contraste
    return true; // Placeholder
  },

  // Gera texto alternativo
  generateAltText: (imageContext) => {
    return `Imagem de ${imageContext}`;
  },

  // Verifica tamanho de toque
  checkTouchTarget: (element) => {
    return element.offsetWidth >= 44 && element.offsetHeight >= 44;
  }
}; 