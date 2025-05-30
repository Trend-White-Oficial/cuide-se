import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';
import { Avatar as PaperAvatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  style,
}) => {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (source) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: size, height: size }]}
        />
      </View>
    );
  }

  if (name) {
    return (
      <PaperAvatar.Text
        size={size}
        label={getInitials(name)}
        style={[styles.avatar, style]}
        color={theme.colors.primary}
      />
    );
  }

  return (
    <PaperAvatar.Icon
      size={size}
      icon="account"
      style={[styles.avatar, style]}
      color={theme.colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 999,
  },
  image: {
    borderRadius: 999,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
}); 