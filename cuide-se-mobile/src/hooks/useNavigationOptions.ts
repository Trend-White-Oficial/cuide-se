import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationOptions } from '@react-navigation/native';

export const useNavigationOptions = (options: NavigationOptions) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions(options);
  }, [navigation, options]);
}; 