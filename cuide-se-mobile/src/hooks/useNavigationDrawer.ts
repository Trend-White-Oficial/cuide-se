import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

export const useNavigationDrawer = (drawerProps: Partial<DrawerContentComponentProps>) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      drawerContent: (props) => ({
        ...props,
        ...drawerProps,
      }),
    });
  }, [navigation, drawerProps]);
}; 