import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type LoadingSize = 'small' | 'large';

export interface LoadingProps {
  /**
   * Tamanho do loading
   * @default 'large'
   */
  size?: LoadingSize;
  /**
   * Cor do loading
   */
  color?: string;
  /**
   * Texto abaixo do loading
   */
  text?: string;
  /**
   * Se o loading está centralizado na tela
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
  text,
  fullScreen = false,
  containerStyle,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: fullScreen ? colors.background : 'transparent' },
        containerStyle,
      ]}
    >
      <ActivityIndicator
        size={size}
        color={color || colors.primary}
      />
      {text && (
        <Text
          style={[
            styles.text,
            typography.body,
            { color: colors.text },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
  },
}); 