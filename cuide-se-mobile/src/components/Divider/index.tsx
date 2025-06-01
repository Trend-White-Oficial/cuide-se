import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps {
  /**
   * Orientação do divisor
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Variante do divisor
   * @default 'solid'
   */
  variant?: DividerVariant;
  /**
   * Espessura do divisor
   * @default 1
   */
  thickness?: number;
  /**
   * Espaçamento vertical
   * @default 8
   */
  spacing?: number;
  /**
   * Se o divisor tem margens
   * @default true
   */
  withMargins?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do divisor
   */
  dividerStyle?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  spacing = 8,
  withMargins = true,
  containerStyle,
  dividerStyle,
}) => {
  const { colors } = useTheme();

  const getBorderStyle = () => {
    switch (variant) {
      case 'dashed':
        return {
          borderStyle: 'dashed',
          borderWidth: thickness,
          borderColor: colors.border,
        };
      case 'dotted':
        return {
          borderStyle: 'dotted',
          borderWidth: thickness,
          borderColor: colors.border,
        };
      case 'solid':
      default:
        return {
          backgroundColor: colors.border,
        };
    }
  };

  const getDimensions = () => {
    if (orientation === 'horizontal') {
      return {
        width: '100%',
        height: thickness,
      };
    }
    return {
      width: thickness,
      height: '100%',
    };
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginVertical: withMargins ? spacing : 0,
          marginHorizontal: withMargins ? spacing : 0,
        },
        containerStyle,
      ]}
    >
      <View
        style={[
          styles.divider,
          getDimensions(),
          getBorderStyle(),
          dividerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    flex: 1,
  },
}); 