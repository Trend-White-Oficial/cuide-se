import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Header } from './Header';
import { useTheme } from '../../hooks/useTheme';

const Stack = createNativeStackNavigator();

interface StackNavigatorProps {
  screens: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: object;
  }>;
  initialRouteName?: string;
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  screens,
  initialRouteName,
}) => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        header: props => <Header {...props} />,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      {screens.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Stack.Navigator>
  );
}; 