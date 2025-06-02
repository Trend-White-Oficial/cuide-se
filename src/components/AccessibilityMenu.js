import React from 'react';
import { useTranslation } from 'react-i18next';
import useAccessibility from '../hooks/useAccessibility';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const AccessibilityMenu = () => {
  const { t } = useTranslation();
  const {
    fontSize,
    highContrast,
    reducedMotion,
    setHighContrast,
    setReducedMotion,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  } = useAccessibility();

  return (
    <div
      style={{
        padding: accessibilityConfig.spacing.medium,
        backgroundColor: accessibilityConfig.colors.background,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ fontSize: accessibilityConfig.typography.large }}>
        {t('Configurações de Acessibilidade')}
      </h2>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Tamanho do Texto')}
        </h3>
        <div style={{ display: 'flex', gap: accessibilityConfig.spacing.small }}>
          <AccessibleButton onClick={decreaseFontSize} ariaLabel={t('Diminuir tamanho do texto')}>
            A-
          </AccessibleButton>
          <AccessibleButton onClick={resetFontSize} ariaLabel={t('Tamanho padrão do texto')}>
            A
          </AccessibleButton>
          <AccessibleButton onClick={increaseFontSize} ariaLabel={t('Aumentar tamanho do texto')}>
            A+
          </AccessibleButton>
        </div>
        <p>{t('Tamanho atual')}: {fontSize}</p>
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Contraste')}
        </h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            aria-label={t('Alternar alto contraste')}
          />
          {t('Alto Contraste')}
        </label>
      </div>

      <div>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Movimento')}
        </h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            aria-label={t('Alternar redução de movimento')}
          />
          {t('Reduzir Movimento')}
        </label>
      </div>
    </div>
  );
};

export default AccessibilityMenu; 