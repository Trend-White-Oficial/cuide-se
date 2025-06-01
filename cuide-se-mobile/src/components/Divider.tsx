import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = THEME_CONFIG.textColor + '20',
  spacing = 16,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
          [orientation === 'horizontal' ? 'height' : 'width']: thickness,
          [orientation === 'horizontal' ? 'marginVertical' : 'marginHorizontal']: spacing,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 