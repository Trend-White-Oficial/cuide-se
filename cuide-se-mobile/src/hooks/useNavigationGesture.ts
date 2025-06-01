import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GestureResponderEvent } from 'react-native';

interface GestureConfig {
  enabled?: boolean;
  onGestureStart?: (event: GestureResponderEvent) => void;
  onGestureEnd?: (event: GestureResponderEvent) => void;
  onGestureCancel?: (event: GestureResponderEvent) => void;
}

export const useNavigationGesture = (gestureConfig: GestureConfig) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: gestureConfig.enabled,
      gestureDirection: 'horizontal',
      gestureResponseDistance: {
        horizontal: 50,
      },
      gestureHandlerProps: {
        onGestureStart: gestureConfig.onGestureStart,
        onGestureEnd: gestureConfig.onGestureEnd,
        onGestureCancel: gestureConfig.onGestureCancel,
      },
    });
  }, [navigation, gestureConfig]);
}; 