import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';

interface TransitionConfig {
  transitionSpec?: {
    open: {
      animation: 'spring' | 'timing';
      config: {
        stiffness?: number;
        damping?: number;
        mass?: number;
        overshootClamping?: boolean;
        restDisplacementThreshold?: number;
        restSpeedThreshold?: number;
        duration?: number;
        easing?: (value: number) => number;
      };
    };
    close: {
      animation: 'spring' | 'timing';
      config: {
        stiffness?: number;
        damping?: number;
        mass?: number;
        overshootClamping?: boolean;
        restDisplacementThreshold?: number;
        restSpeedThreshold?: number;
        duration?: number;
        easing?: (value: number) => number;
      };
    };
  };
  cardStyleInterpolator?: (props: any) => any;
  headerStyleInterpolator?: (props: any) => any;
}

export const useNavigationTransition = (transitionConfig: TransitionConfig) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      transitionSpec: transitionConfig.transitionSpec,
      cardStyleInterpolator: transitionConfig.cardStyleInterpolator,
      headerStyleInterpolator: transitionConfig.headerStyleInterpolator,
    });
  }, [navigation, transitionConfig]);
}; 