import { useNavigationState } from '@react-navigation/native';

export const useNavigationState = () => {
  const state = useNavigationState(state => state);

  return {
    currentRoute: state?.routes[state.index],
    previousRoute: state?.routes[state.index - 1],
    nextRoute: state?.routes[state.index + 1],
    routeCount: state?.routes.length,
    currentIndex: state?.index,
  };
}; 