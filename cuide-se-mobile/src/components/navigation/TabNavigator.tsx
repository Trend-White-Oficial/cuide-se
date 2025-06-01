import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { Header } from './Header';
import { useTheme } from '../../hooks/useTheme';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  screens: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: object;
    icon?: string;
    label?: string;
  }>;
  initialRouteName?: string;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  screens,
  initialRouteName,
}) => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        header: props => <Header {...props} />,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {screens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            tabBarIcon: ({ color, size }) => (
              <Icon name={screen.icon || 'home'} size={size} color={color} />
            ),
            tabBarLabel: screen.label || screen.name,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}; 