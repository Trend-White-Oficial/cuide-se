import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  containerStyle,
  trackStyle,
  thumbStyle,
}) => {
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.container, containerStyle]}
      disabled={disabled}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: value
              ? THEME_CONFIG.primaryColor
              : THEME_CONFIG.textColor + '40',
            opacity: disabled ? 0.5 : 1,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [
                {
                  translateX: translateX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 22],
                  }),
                },
              ],
              backgroundColor: disabled
                ? THEME_CONFIG.textColor + '80'
                : '#FFFFFF',
            },
            thumbStyle,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 