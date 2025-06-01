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

interface RadioProps {
  label?: string;
  value: string;
  selectedValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  selectedValue,
  onChange,
  disabled = false,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
}) => {
  const { colors } = useTheme();
  const isSelected = value === selectedValue;

  const handlePress = () => {
    if (!disabled) {
      onChange(value);
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
            styles.radio,
            {
              borderColor: error
                ? colors.error
                : isSelected
                ? colors.primary
                : colors.border,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.selected,
                {
                  backgroundColor: colors.primary,
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
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
}); 