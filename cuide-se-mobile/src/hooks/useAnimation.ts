import { useRef, useCallback } from 'react';
import { Animated, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useDevice } from './useDevice';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';

// Habilita o LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AnimationConfig {
  duration?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
}

interface LayoutAnimationConfig {
  duration?: number;
  type?: 'linear' | 'easeInEaseOut' | 'spring';
  property?: 'opacity' | 'scale' | 'position';
}

interface AnimationEndResult {
  finished: boolean;
}

export const useAnimation = () => {
  const { systemName } = useDevice();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  // Cria uma referência para o valor animado
  const createAnimatedValue = useCallback(
    (initialValue: number): Animated.Value => {
      return new Animated.Value(initialValue);
    },
    []
  );

  // Cria uma referência para o valor animado com timing
  const createAnimatedValueWithTiming = useCallback(
    (initialValue: number, config?: AnimationConfig): Animated.Value => {
      const animatedValue = new Animated.Value(initialValue);
      const animation = Animated.timing(animatedValue, {
        toValue: initialValue,
        duration: config?.duration || 300,
        easing: config?.easing || Easing.ease,
        useNativeDriver: config?.useNativeDriver ?? true,
      });

      animation.start();

      return animatedValue;
    },
    []
  );

  // Anima um valor para um valor alvo
  const animateValue = useCallback(
    (
      animatedValue: Animated.Value,
      toValue: number,
      config?: AnimationConfig
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const animation = Animated.timing(animatedValue, {
            toValue,
            duration: config?.duration || 300,
            easing: config?.easing || Easing.ease,
            useNativeDriver: config?.useNativeDriver ?? true,
          });

          animation.start((result: AnimationEndResult) => {
            if (result.finished) {
              resolve();
            }
          });

          // Registra o evento
          logEvent('animation_started', {
            to_value: toValue,
            duration: config?.duration || 300,
            easing: config?.easing ? 'custom' : 'ease',
            use_native_driver: config?.useNativeDriver ?? true,
            device: systemName,
          });
        } catch (error) {
          console.error('Erro ao animar valor:', error);
          recordError(error instanceof Error ? error : new Error('Erro ao animar valor'));
          reject(error);
        }
      });
    },
    [systemName, logEvent, recordError]
  );

  // Anima um valor com spring
  const animateSpring = useCallback(
    (
      animatedValue: Animated.Value,
      toValue: number,
      config?: Animated.SpringAnimationConfig
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const animation = Animated.spring(animatedValue, {
            toValue,
            useNativeDriver: true,
            ...config,
          });

          animation.start((result: AnimationEndResult) => {
            if (result.finished) {
              resolve();
            }
          });

          // Registra o evento
          logEvent('spring_animation_started', {
            to_value: toValue,
            friction: config?.friction,
            tension: config?.tension,
            device: systemName,
          });
        } catch (error) {
          console.error('Erro ao animar spring:', error);
          recordError(error instanceof Error ? error : new Error('Erro ao animar spring'));
          reject(error);
        }
      });
    },
    [systemName, logEvent, recordError]
  );

  // Anima um valor com loop
  const animateLoop = useCallback(
    (
      animatedValue: Animated.Value,
      config?: AnimationConfig & {
        iterations?: number;
        resetBeforeIteration?: boolean;
      }
    ): Animated.CompositeAnimation => {
      try {
        const animation = Animated.loop(
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: config?.duration || 1000,
            easing: config?.easing || Easing.linear,
            useNativeDriver: config?.useNativeDriver ?? true,
          }),
          {
            iterations: config?.iterations || -1,
            resetBeforeIteration: config?.resetBeforeIteration ?? true,
          }
        );

        animation.start();

        // Registra o evento
        logEvent('loop_animation_started', {
          duration: config?.duration || 1000,
          iterations: config?.iterations || -1,
          device: systemName,
        });

        return animation;
      } catch (error) {
        console.error('Erro ao animar loop:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao animar loop'));
        throw error;
      }
    },
    [systemName, logEvent, recordError]
  );

  // Anima um valor com sequência
  const animateSequence = useCallback(
    (
      animations: Animated.CompositeAnimation[],
      config?: AnimationConfig
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const sequence = Animated.sequence(animations);

          sequence.start((result: AnimationEndResult) => {
            if (result.finished) {
              resolve();
            }
          });

          // Registra o evento
          logEvent('sequence_animation_started', {
            animations_count: animations.length,
            device: systemName,
          });
        } catch (error) {
          console.error('Erro ao animar sequência:', error);
          recordError(error instanceof Error ? error : new Error('Erro ao animar sequência'));
          reject(error);
        }
      });
    },
    [systemName, logEvent, recordError]
  );

  // Anima um valor com paralelo
  const animateParallel = useCallback(
    (
      animations: Animated.CompositeAnimation[],
      config?: AnimationConfig
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const parallel = Animated.parallel(animations);

          parallel.start((result: AnimationEndResult) => {
            if (result.finished) {
              resolve();
            }
          });

          // Registra o evento
          logEvent('parallel_animation_started', {
            animations_count: animations.length,
            device: systemName,
          });
        } catch (error) {
          console.error('Erro ao animar paralelo:', error);
          recordError(error instanceof Error ? error : new Error('Erro ao animar paralelo'));
          reject(error);
        }
      });
    },
    [systemName, logEvent, recordError]
  );

  // Anima um layout
  const animateLayout = useCallback(
    (config?: LayoutAnimationConfig): void => {
      try {
        LayoutAnimation.configureNext({
          duration: config?.duration || 300,
          create: {
            type: config?.type || 'easeInEaseOut',
            property: config?.property || 'opacity',
          },
          update: {
            type: config?.type || 'easeInEaseOut',
          },
          delete: {
            type: config?.type || 'easeInEaseOut',
            property: config?.property || 'opacity',
          },
        });

        // Registra o evento
        logEvent('layout_animation_started', {
          duration: config?.duration || 300,
          type: config?.type || 'easeInEaseOut',
          property: config?.property || 'opacity',
          device: systemName,
        });
      } catch (error) {
        console.error('Erro ao animar layout:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao animar layout'));
      }
    },
    [systemName, logEvent, recordError]
  );

  return {
    createAnimatedValue,
    createAnimatedValueWithTiming,
    animateValue,
    animateSpring,
    animateLoop,
    animateSequence,
    animateParallel,
    animateLayout,
  };
}; 