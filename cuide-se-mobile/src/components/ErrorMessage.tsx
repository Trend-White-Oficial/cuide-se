import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  retryButtonStyle?: ViewStyle;
  retryButtonTextStyle?: TextStyle;
  retryButtonText?: string;
  icon?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  containerStyle,
  messageStyle,
  retryButtonStyle,
  retryButtonTextStyle,
  retryButtonText = 'Tentar novamente',
  icon,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.errorBackground,
        },
        containerStyle,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.message,
          {
            color: colors.error,
          },
          messageStyle,
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            {
              backgroundColor: colors.error,
            },
            retryButtonStyle,
          ]}
          onPress={onRetry}
        >
          <Text
            style={[
              styles.retryButtonText,
              {
                color: colors.white,
              },
              retryButtonTextStyle,
            ]}
          >
            {retryButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 