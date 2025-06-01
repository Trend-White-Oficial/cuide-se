import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  containerStyle,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return THEME_CONFIG.primaryColor;
      case 'success':
        return THEME_CONFIG.successColor;
      case 'warning':
        return THEME_CONFIG.warningColor;
      case 'error':
        return THEME_CONFIG.errorColor;
      case 'info':
        return THEME_CONFIG.infoColor;
      default:
        return THEME_CONFIG.primaryColor;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 6 };
      case 'large':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      default:
        return { paddingVertical: 4, paddingHorizontal: 8 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: getFontSize(),
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 