import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = THEME_CONFIG.textColor,
  style,
}) => {
  const getIcon = () => {
    switch (name) {
      case 'home':
        return '🏠';
      case 'calendar':
        return '📅';
      case 'user':
        return '👤';
      case 'settings':
        return '⚙️';
      case 'plus':
        return '➕';
      case 'minus':
        return '➖';
      case 'edit':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'check':
        return '✅';
      case 'close':
        return '❌';
      case 'search':
        return '🔍';
      case 'filter':
        return '🔧';
      case 'sort':
        return '↕️';
      case 'back':
        return '←';
      case 'forward':
        return '→';
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'menu':
        return '☰';
      case 'notification':
        return '🔔';
      case 'message':
        return '💬';
      case 'phone':
        return '📞';
      case 'email':
        return '📧';
      case 'location':
        return '📍';
      case 'time':
        return '⏰';
      case 'date':
        return '📆';
      case 'star':
        return '⭐';
      case 'heart':
        return '❤️';
      case 'share':
        return '📤';
      case 'download':
        return '⬇️';
      case 'upload':
        return '⬆️';
      case 'refresh':
        return '🔄';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '❓';
    }
  };

  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color,
        },
        style,
      ]}
    >
      {getIcon()}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
}); 