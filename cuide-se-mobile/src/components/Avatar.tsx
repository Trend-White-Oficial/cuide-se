import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  textStyle?: TextStyle;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  onPress,
  containerStyle,
  imageStyle,
  textStyle,
  showBorder = false,
  borderColor,
  borderWidth = 2,
}) => {
  const { colors } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          borderColor: borderColor || colors.border,
          borderWidth: showBorder ? borderWidth : 0,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            imageStyle,
          ]}
        />
      ) : name ? (
        <Text
          style={[
            styles.text,
            {
              color: colors.white,
              fontSize: size * 0.4,
            },
            textStyle,
          ]}
        >
          {getInitials(name)}
        </Text>
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '600',
  },
}); 