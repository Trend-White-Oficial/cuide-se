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

interface EmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  actionStyle?: ViewStyle;
  actionTextStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionText,
  onAction,
  containerStyle,
  messageStyle,
  actionStyle,
  actionTextStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.message, messageStyle]}>
        {message}
      </Text>
      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.actionButton, actionStyle]}
        >
          <Text style={[styles.actionText, actionTextStyle]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: THEME_CONFIG.textColor + '80',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: THEME_CONFIG.primaryColor,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 