import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const useNavigationTabBar = (tabBarProps: Partial<BottomTabBarProps>) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBar: (props) => ({
        ...props,
        ...tabBarProps,
      }),
    });
  }, [navigation, tabBarProps]);
}; 