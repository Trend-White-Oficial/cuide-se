import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenProps } from '@react-navigation/native';

interface ScreenConfig {
  name: string;
  options?: ScreenProps['options'];
  initialParams?: ScreenProps['initialParams'];
}

export const useNavigationScreen = (screenConfig: ScreenConfig) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      screen: {
        name: screenConfig.name,
        options: screenConfig.options,
        initialParams: screenConfig.initialParams,
      },
    });
  }, [navigation, screenConfig]);
}; 