import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type BadgeType = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeProps {
  /**
   * Conteúdo do badge
   */
  content?: string | number;
  /**
   * Tipo do badge
   * @default 'primary'
   */
  type?: BadgeType;
  /**
   * Tamanho do badge
   * @default 'medium'
   */
  size?: BadgeSize;
  /**
   * Posição do badge
   * @default 'top-right'
   */
  position?: BadgePosition;
  /**
   * Se o badge é apenas um ponto
   * @default false
   */
  dot?: boolean;
  /**
   * Se o badge está visível
   * @default true
   */
  visible?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do texto
   */
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  content,
  type = 'primary',
  size = 'medium',
  position = 'top-right',
  dot = false,
  visible = true,
  containerStyle,
  textStyle,
}) => {
  const { colors, typography } = useTheme();

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getSize = () => {
    if (dot) {
      switch (size) {
        case 'small':
          return 8;
        case 'medium':
          return 10;
        case 'large':
          return 12;
        default:
          return 10;
      }
    }

    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.caption.fontSize;
      case 'medium':
        return typography.body.fontSize;
      case 'large':
        return typography.subtitle.fontSize;
      default:
        return typography.body.fontSize;
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top-right':
        return { top: -4, right: -4 };
      case 'top-left':
        return { top: -4, left: -4 };
      case 'bottom-right':
        return { bottom: -4, right: -4 };
      case 'bottom-left':
        return { bottom: -4, left: -4 };
      default:
        return { top: -4, right: -4 };
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: getSize(),
          height: getSize(),
          borderRadius: getSize() / 2,
          backgroundColor: getBackgroundColor(),
          ...getPosition(),
        },
        !dot && styles.contentContainer,
        containerStyle,
      ]}
    >
      {!dot && content && (
        <Text
          style={[
            styles.content,
            {
              fontSize: getFontSize(),
              color: colors.white,
            },
            textStyle,
          ]}
        >
          {content}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    minWidth: 20,
    paddingHorizontal: 4,
  },
  content: {
    textAlign: 'center',
  },
}); 