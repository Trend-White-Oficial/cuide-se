import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  containerStyle,
  textStyle,
  retryText = 'Tentar novamente',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.message, textStyle]}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>
            {retryText}
          </Text>
        </TouchableOpacity>
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
  message: {
    color: THEME_CONFIG.errorColor,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: THEME_CONFIG.primaryColor,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 