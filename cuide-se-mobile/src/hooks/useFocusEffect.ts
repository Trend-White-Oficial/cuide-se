import { useEffect, useRef } from 'react';
import { useFocusEffect as useNavigationFocusEffect } from '@react-navigation/native';

export const useFocusEffect = (callback: () => void | (() => void)) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useNavigationFocusEffect(() => {
    const cleanup = callbackRef.current();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  });
}; 