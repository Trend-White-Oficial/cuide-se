import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface InputProps extends TextInputProps {
  /**
   * Label do input
   */
  label?: string;
  /**
   * Mensagem de erro
   */
  error?: string;
  /**
   * Ícone à esquerda
   */
  leftIcon?: React.ReactNode;
  /**
   * Ícone à direita
   */
  rightIcon?: React.ReactNode;
  /**
   * Função chamada ao clicar no ícone direito
   */
  onRightIconPress?: () => void;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do input
   */
  inputStyle?: TextStyle;
  /**
   * Estilo personalizado do label
   */
  labelStyle?: TextStyle;
  /**
   * Estilo personalizado da mensagem de erro
   */
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...rest
}) => {
  const { colors, spacing, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            typography.caption,
            { color: colors.text },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            paddingHorizontal: spacing.sm,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            typography.body,
            { color: colors.text },
            inputStyle,
          ]}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            typography.caption,
            { color: colors.error },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  iconContainer: {
    paddingHorizontal: 8,
  },
  error: {
    marginTop: 4,
  },
}); 