import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SwitchProps extends AccessibilityProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: {
    false: string;
    true: string;
  };
  containerStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  labelPosition?: 'left' | 'right';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  color,
  trackColor,
  thumbColor,
  containerStyle,
  trackStyle,
  thumbStyle,
  label,
  labelStyle,
  labelPosition = 'right',
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'switch',
  accessibilityState,
}) => {
  const { colors, typography, spacing } = useTheme();
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [value]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 20,
          thumbSize: 16,
        };
      case 'large':
        return {
          width: 60,
          height: 30,
          thumbSize: 26,
        };
      default:
        return {
          width: 50,
          height: 24,
          thumbSize: 20,
        };
    }
  };

  const { width, height, thumbSize } = getSize();

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <Text
        style={[
          styles.label,
          typography.body,
          { color: colors.text },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { opacity: disabled ? 0.5 : 1 },
        containerStyle,
      ]}
    >
      {labelPosition === 'left' && renderLabel()}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          ...accessibilityState,
          checked: value,
          disabled,
        }}
      >
        <View
          style={[
            styles.track,
            {
              width,
              height,
              backgroundColor: value
                ? trackColor?.true || color || colors.primary
                : trackColor?.false || colors.border,
            },
            trackStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                backgroundColor: value
                  ? thumbColor?.true || colors.white
                  : thumbColor?.false || colors.white,
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, width - thumbSize - 2],
                    }),
                  },
                ],
              },
              thumbStyle,
            ]}
          />
        </View>
      </TouchableOpacity>
      {labelPosition === 'right' && renderLabel()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    borderRadius: 100,
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    marginHorizontal: 8,
  },
}); 