import { useRoute } from '@react-navigation/native';

export const useNavigationParam = <T>(paramName: string): T | undefined => {
  const route = useRoute();
  return route.params?.[paramName] as T | undefined;
}; 