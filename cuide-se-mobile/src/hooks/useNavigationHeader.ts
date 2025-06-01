import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HeaderProps } from '../components/navigation/Header';

export const useNavigationHeader = (headerProps: Partial<HeaderProps>) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => ({
        ...props,
        ...headerProps,
      }),
    });
  }, [navigation, headerProps]);
}; 