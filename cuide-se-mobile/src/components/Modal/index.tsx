import React, { useEffect } from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  ViewStyle,
  ModalProps as RNModalProps,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ModalProps extends Omit<RNModalProps, 'children'> {
  /**
   * Conteúdo do modal
   */
  children: React.ReactNode;
  /**
   * Se o modal está visível
   */
  visible: boolean;
  /**
   * Função chamada ao fechar o modal
   */
  onClose: () => void;
  /**
   * Se o modal pode ser fechado tocando fora
   * @default true
   */
  dismissible?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do conteúdo
   */
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  visible,
  onClose,
  dismissible = true,
  containerStyle,
  contentStyle,
  ...rest
}) => {
  const { colors } = useTheme();
  const { height: screenHeight } = Dimensions.get('window');
  const translateY = new Animated.Value(screenHeight);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, screenHeight]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...rest}
    >
      <TouchableWithoutFeedback onPress={dismissible ? onClose : undefined}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                { backgroundColor: colors.surface },
                containerStyle,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={[styles.content, contentStyle]}>{children}</View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    maxHeight: '80%',
  },
  content: {
    padding: 16,
  },
}); 