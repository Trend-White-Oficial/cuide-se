import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: number;
  containerStyle?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  spacing = 8,
  containerStyle,
}) => {
  const { colors } = useTheme();

  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color || colors.border,
          height: isHorizontal ? thickness : '100%',
          width: isHorizontal ? '100%' : thickness,
          marginVertical: isHorizontal ? spacing : 0,
          marginHorizontal: isHorizontal ? 0 : spacing,
        },
        containerStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
}); 