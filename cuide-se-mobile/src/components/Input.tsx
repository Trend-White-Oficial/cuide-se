import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={THEME_CONFIG.textColor + '80'}
        {...props}
      />
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: THEME_CONFIG.textColor,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: THEME_CONFIG.textColor + '40',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: THEME_CONFIG.textColor,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  inputError: {
    borderColor: THEME_CONFIG.errorColor,
  },
  error: {
    color: THEME_CONFIG.errorColor,
    fontSize: 14,
    marginTop: 4,
  },
}); 