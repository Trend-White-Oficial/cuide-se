import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useNavigationTitle = (title: string) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation, title]);
}; 