import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ErrorMessageProps {
  /**
   * Mensagem de erro
   */
  message: string;
  /**
   * Descrição adicional do erro
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
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado da mensagem
   */
  messageStyle?: TextStyle;
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
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  actionText,
  onActionPress,
  containerStyle,
  messageStyle,
  descriptionStyle,
  actionStyle,
  actionTextStyle,
}) => {
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.errorBackground },
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.message,
          typography.subtitle,
          { color: colors.error },
          messageStyle,
        ]}
      >
        {message}
      </Text>
      {description && (
        <Text
          style={[
            styles.description,
            typography.body,
            { color: colors.text },
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
            { marginTop: spacing.sm },
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
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.1)',
  },
  message: {
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  actionButton: {
    alignSelf: 'center',
  },
  actionText: {
    textAlign: 'center',
  },
}); 