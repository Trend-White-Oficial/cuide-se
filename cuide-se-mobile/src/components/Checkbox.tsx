import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.row}
        onPress={handlePress}
        disabled={disabled}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: checked ? colors.primary : colors.card,
              borderColor: error
                ? colors.error
                : checked
                ? colors.primary
                : colors.border,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {checked && (
            <View
              style={[
                styles.checkmark,
                {
                  borderColor: colors.background,
                },
              ]}
            />
          )}
        </View>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: colors.text,
                opacity: disabled ? 0.5 : 1,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.error,
            },
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  label: {
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
}); 