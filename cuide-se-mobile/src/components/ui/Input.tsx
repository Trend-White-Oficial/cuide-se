import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  disabled?: boolean;
  placeholder?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  style,
  disabled = false,
  placeholder,
  right,
  left,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        disabled={disabled}
        placeholder={placeholder}
        right={right}
        left={left}
        mode="outlined"
        error={!!error}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        theme={{
          colors: {
            primary: theme.colors.primary,
            error: theme.colors.error,
          },
        }}
      />
      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: theme.colors.error,
            },
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
    marginBottom: 16,
  },
  input: {
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 