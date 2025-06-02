import React from 'react';
import { useTranslation } from 'react-i18next';
import { accessibilityConfig } from '../config/accessibility';

const AccessibleButton = ({
  onClick,
  children,
  ariaLabel,
  disabled = false,
  type = 'button',
  variant = 'primary'
}) => {
  const { t } = useTranslation();
  
  const getButtonStyles = () => {
    const baseStyles = {
      padding: accessibilityConfig.spacing.medium,
      fontSize: accessibilityConfig.typography.medium,
      borderRadius: '4px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: `all ${accessibilityConfig.animation.duration} ${accessibilityConfig.animation.timing}`,
      minHeight: '44px', // WCAG touch target size
      minWidth: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: accessibilityConfig.spacing.small,
      '&:focus': {
        outline: accessibilityConfig.focus.outline,
        outlineOffset: accessibilityConfig.focus.outlineOffset
      }
    };

    const variantStyles = {
      primary: {
        backgroundColor: accessibilityConfig.colors.primary,
        color: '#FFFFFF',
        '&:hover': {
          opacity: 0.9
        }
      },
      secondary: {
        backgroundColor: accessibilityConfig.colors.secondary,
        color: '#FFFFFF',
        '&:hover': {
          opacity: 0.9
        }
      }
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1
    };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || t(children)}
      style={getButtonStyles()}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
};

export default AccessibleButton; 