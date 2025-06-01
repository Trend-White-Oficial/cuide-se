import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  keyboardOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
}

interface ToastState {
  visible: boolean;
  message: string | null;
  description: string | null;
  type: ToastOptions['type'];
  loading: boolean;
  error: string | null;
}

export const useToast = () => {
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: null,
    description: null,
    type: 'info',
    loading: false,
    error: null,
  });

  const showToast = useCallback((
    message: string,
    description?: string,
    options: ToastOptions = {},
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const {
        type = 'info',
        position = 'top',
        visibilityTime = 4000,
        autoHide = true,
        topOffset = 40,
        bottomOffset = 40,
        keyboardOffset = 10,
        onShow,
        onHide,
        onPress,
      } = options;

      Toast.show({
        type,
        text1: message,
        text2: description,
        position,
        visibilityTime,
        autoHide,
        topOffset,
        bottomOffset,
        keyboardOffset,
        onShow,
        onHide,
        onPress,
      });

      setState({
        visible: true,
        message,
        description: description || null,
        type,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao mostrar toast',
      }));
    }
  }, []);

  const hideToast = useCallback(() => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      Toast.hide();

      setState(prev => ({
        ...prev,
        visible: false,
        message: null,
        description: null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao esconder toast',
      }));
    }
  }, []);

  return {
    ...state,
    showToast,
    hideToast,
  };
}; 