import { useIsFocused as useNavigationIsFocused } from '@react-navigation/native';

export const useIsFocused = () => {
  return useNavigationIsFocused();
}; 