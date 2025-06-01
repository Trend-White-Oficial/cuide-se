import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonStyle?: ViewStyle;
  closeButtonTextStyle?: TextStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  containerStyle,
  titleStyle,
  contentStyle,
  animationType = 'fade',
  transparent = true,
  showCloseButton = true,
  closeButtonText = 'Fechar',
  closeButtonStyle,
  closeButtonTextStyle,
}) => {
  const { colors } = useTheme();
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: animation,
            },
            containerStyle,
          ]}
        >
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
          <View style={[styles.content, contentStyle]}>{children}</View>
          {showCloseButton && (
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.primary,
                },
                closeButtonStyle,
              ]}
              onPress={onClose}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  {
                    color: colors.white,
                  },
                  closeButtonTextStyle,
                ]}
              >
                {closeButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width * 0.9,
    maxWidth: 500,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    marginBottom: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 