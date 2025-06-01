import { useEffect, useCallback } from 'react';
import { BackHandler, BackHandlerEvent } from 'react-native';

type BackHandlerCallback = () => boolean;

export const useBackHandler = (callback: BackHandlerCallback) => {
  const handleBackPress = useCallback(
    (event: BackHandlerEvent) => {
      return callback();
    },
    [callback]
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [handleBackPress]);
}; 