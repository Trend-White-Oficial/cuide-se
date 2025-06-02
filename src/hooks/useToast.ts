import { useCallback } from 'react';
import { useToast as useToastNative } from 'react-native-toast-notifications';

export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
}

export const useToast = () => {
  const toast = useToastNative();

  const showToast = useCallback((options: ToastOptions) => {
    const { type, message, description } = options;
    toast.show(message, {
      type,
      description,
      duration: 3000,
      placement: 'top',
      animationType: 'slide-in',
    });
  }, [toast]);

  return { showToast };
}; 