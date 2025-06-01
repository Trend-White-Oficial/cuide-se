import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

interface RouteConfig<T extends object> {
  name: string;
  params?: T;
  key?: string;
}

export const useNavigationRoute = <T extends object>(routeConfig: RouteConfig<T>) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      route: {
        name: routeConfig.name,
        params: routeConfig.params,
        key: routeConfig.key,
      },
    });
  }, [navigation, routeConfig]);
}; 