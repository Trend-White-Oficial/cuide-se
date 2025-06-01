import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';

interface AnimationConfig {
  animation?: 'default' | 'none' | 'fade' | 'slide';
  animationDuration?: number;
  animationType?: 'push' | 'pop';
  animationEnabled?: boolean;
}

export const useNavigationAnimation = (animationConfig: AnimationConfig) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: animationConfig.animation,
      animationDuration: animationConfig.animationDuration,
      animationType: animationConfig.animationType,
      animationEnabled: animationConfig.animationEnabled,
    });
  }, [navigation, animationConfig]);
};
