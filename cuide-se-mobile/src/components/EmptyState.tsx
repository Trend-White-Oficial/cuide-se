import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  description?: string;
  image?: ImageSourcePropType;
  buttonText?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  imageStyle?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  image,
  buttonText,
  onPress,
  containerStyle,
  titleStyle,
  descriptionStyle,
  buttonStyle,
  buttonTextStyle,
  imageStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
        containerStyle,
      ]}
    >
      {image && (
        <Image
          source={image}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      )}
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
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
            },
            descriptionStyle,
          ]}
        >
          {description}
        </Text>
      )}
      {buttonText && onPress && (
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
            },
            buttonStyle,
          ]}
          onPress={onPress}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: colors.white,
              },
              buttonTextStyle,
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 