import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  /**
   * Fonte da imagem do avatar
   */
  source?: ImageSourcePropType;
  /**
   * Iniciais a serem exibidas quando não há imagem
   */
  initials?: string;
  /**
   * Tamanho do avatar
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * Forma do avatar
   * @default 'circle'
   */
  shape?: AvatarShape;
  /**
   * Se o avatar está online
   */
  online?: boolean;
  /**
   * Se o avatar é clicável
   */
  pressable?: boolean;
  /**
   * Função chamada ao clicar no avatar
   */
  onPress?: () => void;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado da imagem
   */
  imageStyle?: ImageStyle;
  /**
   * Estilo personalizado do texto das iniciais
   */
  textStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'medium',
  shape = 'circle',
  online,
  pressable,
  onPress,
  containerStyle,
  imageStyle,
  textStyle,
}) => {
  const { colors, typography } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.caption.fontSize;
      case 'medium':
        return typography.body.fontSize;
      case 'large':
        return typography.h6.fontSize;
      case 'xlarge':
        return typography.h4.fontSize;
      default:
        return typography.body.fontSize;
    }
  };

  const Container = pressable ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        {
          width: getSize(),
          height: getSize(),
          borderRadius: shape === 'circle' ? getSize() / 2 : 8,
          backgroundColor: colors.surface,
        },
        containerStyle,
      ]}
      onPress={onPress}
      disabled={!pressable}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: getSize(),
              height: getSize(),
              borderRadius: shape === 'circle' ? getSize() / 2 : 8,
            },
            imageStyle,
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: getFontSize(),
              color: colors.text,
            },
            textStyle,
          ]}
        >
          {initials?.toUpperCase()}
        </Text>
      )}
      {online && (
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: colors.success,
              borderColor: colors.background,
            },
          ]}
        />
      )}
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
  initials: {
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
}); 