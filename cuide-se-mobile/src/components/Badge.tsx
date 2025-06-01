import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  onPress,
  containerStyle,
  textStyle,
  dot = false,
}) => {
  const { colors } = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
          fontSize: 10,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          fontSize: 12,
        };
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  const sizeStyles = getSizeStyles();
  const variantColor = getVariantColor();

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: variantColor,
          paddingHorizontal: dot ? sizeStyles.paddingVertical : sizeStyles.paddingHorizontal,
          paddingVertical: dot ? sizeStyles.paddingVertical : sizeStyles.paddingVertical,
          borderRadius: dot ? sizeStyles.paddingVertical : sizeStyles.borderRadius,
          minWidth: dot ? sizeStyles.paddingVertical * 2 : undefined,
          minHeight: dot ? sizeStyles.paddingVertical * 2 : undefined,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      {!dot && (
        <Text
          style={[
            styles.text,
            {
              color: colors.white,
              fontSize: sizeStyles.fontSize,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
}); 