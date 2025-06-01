import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../Loading';

interface NavigationContainerProps {
  children: React.ReactNode;
}

export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
}) => {
  const { theme } = useTheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <RNNavigationContainer
      theme={{
        dark: theme.dark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.notification,
        },
      }}
    >
      {children}
    </RNNavigationContainer>
  );
}; 