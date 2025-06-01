import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { NAVIGATION_CONFIG } from '../config';
import { Icon } from '../components/Icon';
import { Drawer } from '../components/Drawer';

// Telas de Autenticação
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Telas Principais
import { HomeScreen } from '../screens/main/HomeScreen';
import { AppointmentsScreen } from '../screens/main/AppointmentsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { ServicesScreen } from '../screens/main/ServicesScreen';
import { HelpScreen } from '../screens/main/HelpScreen';

// Tipos para as rotas
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Services: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Settings: undefined;
  Help: undefined;
};

// Criação dos navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const DrawerNav = createDrawerNavigator<DrawerParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Appointments':
              iconName = 'calendar';
              break;
            case 'Services':
              iconName = 'list';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen} 
        options={{ title: 'Agendamentos' }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ title: 'Serviços' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <DrawerNav.Navigator
      drawerContent={(props) => (
        <Drawer
          items={[
            { label: 'Início', icon: 'home', route: 'MainTabs' },
            { label: 'Configurações', icon: 'settings', route: 'Settings' },
            { label: 'Ajuda', icon: 'help-circle', route: 'Help' },
          ]}
          onClose={() => props.navigation.closeDrawer()}
        />
      )}
    >
      <DrawerNav.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <DrawerNav.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Configurações' }}
      />
      <DrawerNav.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{ title: 'Ajuda' }}
      />
    </DrawerNav.Navigator>
  );
};

export const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 