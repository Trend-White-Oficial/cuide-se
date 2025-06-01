import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Drawer } from './Drawer';
import { Header } from './Header';
import { useTheme } from '../../hooks/useTheme';

const DrawerNav = createDrawerNavigator();

interface DrawerNavigatorProps {
  screens: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: object;
    icon?: string;
    label?: string;
  }>;
  initialRouteName?: string;
}

export const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({
  screens,
  initialRouteName,
}) => {
  const { theme } = useTheme();

  return (
    <DrawerNav.Navigator
      initialRouteName={initialRouteName}
      drawerContent={props => <Drawer {...props} />}
      screenOptions={{
        header: props => <Header {...props} />,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        drawerStyle: {
          backgroundColor: theme.colors.card,
          width: '80%',
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
      }}
    >
      {screens.map(screen => (
        <DrawerNav.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            drawerIcon: ({ color, size }) => (
              <Icon name={screen.icon || 'menu'} size={size} color={color} />
            ),
            drawerLabel: screen.label || screen.name,
          }}
        />
      ))}
    </DrawerNav.Navigator>
  );
}; 