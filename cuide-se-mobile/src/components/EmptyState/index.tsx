import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface EmptyStateProps {
  /**
   * Título do estado vazio
   */
  title: string;
  /**
   * Descrição do estado vazio
   */
  description?: string;
  /**
   * Texto do botão de ação
   */
  actionText?: string;
  /**
   * Função chamada ao clicar no botão de ação
   */
  onActionPress?: () => void;
  /**
   * Imagem do estado vazio
   */
  image?: any;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do título
   */
  titleStyle?: TextStyle;
  /**
   * Estilo personalizado da descrição
   */
  descriptionStyle?: TextStyle;
  /**
   * Estilo personalizado do botão
   */
  actionStyle?: ViewStyle;
  /**
   * Estilo personalizado do texto do botão
   */
  actionTextStyle?: TextStyle;
  /**
   * Estilo personalizado da imagem
   */
  imageStyle?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onActionPress,
  image,
  containerStyle,
  titleStyle,
  descriptionStyle,
  actionStyle,
  actionTextStyle,
  imageStyle,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
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
          typography.h6,
          { color: colors.text },
          titleStyle,
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            styles.description,
            typography.body,
            { color: colors.textSecondary },
            descriptionStyle,
          ]}
        >
          {description}
        </Text>
      )}
      {actionText && onActionPress && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { marginTop: spacing.md },
            actionStyle,
          ]}
          onPress={onActionPress}
        >
          <Text
            style={[
              styles.actionText,
              typography.button,
              { color: colors.primary },
              actionTextStyle,
            ]}
          >
            {actionText}
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
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
  },
  actionButton: {
    alignSelf: 'center',
  },
  actionText: {
    textAlign: 'center',
  },
}); 