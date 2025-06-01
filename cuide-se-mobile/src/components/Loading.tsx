import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LoadingProps {
  visible: boolean;
  message?: string;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  size?: 'small' | 'large';
  color?: string;
  overlayColor?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  visible,
  message,
  containerStyle,
  messageStyle,
  size = 'large',
  color,
  overlayColor,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: overlayColor || 'rgba(0, 0, 0, 0.5)',
          },
        ]}
      >
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.card,
            },
            containerStyle,
          ]}
        >
          <ActivityIndicator
            size={size}
            color={color || colors.primary}
          />
          {message && (
            <Text
              style={[
                styles.message,
                {
                  color: colors.text,
                },
                messageStyle,
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
    minHeight: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
}); 