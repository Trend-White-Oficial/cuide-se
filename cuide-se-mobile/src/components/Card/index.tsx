import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CardProps extends TouchableOpacityProps {
  /**
   * Conteúdo do card
   */
  children: React.ReactNode;
  /**
   * Variante do card
   * @default 'elevated'
   */
  variant?: 'elevated' | 'outlined' | 'flat';
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Se o card é clicável
   * @default false
   */
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  containerStyle,
  pressable = false,
  ...rest
}) => {
  const { colors, spacing } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface,
        };
      default:
        return {};
    }
  };

  const Container = pressable ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        getVariantStyles(),
        { padding: spacing.md },
        containerStyle,
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
}); 