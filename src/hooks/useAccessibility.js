import { useState, useEffect } from 'react';
import { accessibilityConfig } from '../config/accessibility';

const useAccessibility = () => {
  const [fontSize, setFontSize] = useState(accessibilityConfig.typography.baseSize);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Aplica as configurações de acessibilidade ao documento
    document.documentElement.style.fontSize = fontSize;
    
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  const increaseFontSize = () => {
    const currentSize = parseInt(fontSize);
    if (currentSize < 24) { // Limite máximo de tamanho
      setFontSize(`${currentSize + 2}px`);
    }
  };

  const decreaseFontSize = () => {
    const currentSize = parseInt(fontSize);
    if (currentSize > 12) { // Limite mínimo de tamanho
      setFontSize(`${currentSize - 2}px`);
    }
  };

  const resetFontSize = () => {
    setFontSize(accessibilityConfig.typography.baseSize);
  };

  return {
    fontSize,
    highContrast,
    reducedMotion,
    setHighContrast,
    setReducedMotion,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  };
};

export default useAccessibility; 