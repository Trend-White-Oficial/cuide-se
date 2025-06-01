import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

type NavigationEventCallback = () => void;

interface NavigationEventHandlers {
  onFocus?: NavigationEventCallback;
  onBlur?: NavigationEventCallback;
  onBeforeRemove?: NavigationEventCallback;
  onStateChange?: NavigationEventCallback;
}

export const useNavigationEvents = ({
  onFocus,
  onBlur,
  onBeforeRemove,
  onStateChange,
}: NavigationEventHandlers) => {
  const navigation = useNavigation();

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handleBeforeRemove = useCallback(() => {
    onBeforeRemove?.();
  }, [onBeforeRemove]);

  const handleStateChange = useCallback(() => {
    onStateChange?.();
  }, [onStateChange]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', handleFocus);
    const unsubscribeBlur = navigation.addListener('blur', handleBlur);
    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', handleBeforeRemove);
    const unsubscribeStateChange = navigation.addListener('state', handleStateChange);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeBeforeRemove();
      unsubscribeStateChange();
    };
  }, [
    navigation,
    handleFocus,
    handleBlur,
    handleBeforeRemove,
    handleStateChange,
  ]);
}; 