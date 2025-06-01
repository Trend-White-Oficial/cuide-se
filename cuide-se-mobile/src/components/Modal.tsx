import React from 'react';
import {
  View,
  Modal as RNModal,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  closeOnBackdropPress?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  containerStyle,
  contentStyle,
  animationType = 'fade',
  transparent = true,
  closeOnBackdropPress = true,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <View style={[styles.container, containerStyle]}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, contentStyle]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
}); 