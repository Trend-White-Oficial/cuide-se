import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  title?: string;
  subtitle?: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  imageStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  footer?: React.ReactNode;
  footerStyle?: ViewStyle;
  elevation?: number;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  onPress,
  children,
  containerStyle,
  titleStyle,
  subtitleStyle,
  imageStyle,
  contentStyle,
  footer,
  footerStyle,
  elevation = 2,
  border = true,
}) => {
  const { colors } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: border ? colors.border : 'transparent',
          shadowColor: colors.shadow,
          elevation,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      {image && (
        <Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      )}
      <View style={[styles.content, contentStyle]}>
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
              subtitleStyle,
            ]}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </View>
      {footer && (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
            },
            footerStyle,
          ]}
        >
          {footer}
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    padding: 16,
  },
}); 