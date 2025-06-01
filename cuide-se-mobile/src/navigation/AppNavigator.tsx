import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';

// Telas de Autenticação
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Telas do Cliente
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import ProfessionalsScreen from '../screens/ProfessionalsScreen';
import ProfessionalDetailsScreen from '../screens/ProfessionalDetailsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SupportScreen from '../screens/SupportScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';

// Telas do Profissional
import ProfessionalHomeScreen from '../screens/professional/HomeScreen';
import ProfessionalScheduleScreen from '../screens/professional/ScheduleScreen';
import ProfessionalClientsScreen from '../screens/professional/ClientsScreen';
import ProfessionalServicesScreen from '../screens/professional/ServicesScreen';
import ProfessionalProfileScreen from '../screens/professional/ProfileScreen';
import ProfessionalSettingsScreen from '../screens/professional/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ClientTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color, size }) => (
            <Icon name="spa" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          title: 'Agendamentos',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function ProfessionalTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="ProfessionalHome"
        component={ProfessionalHomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfessionalSchedule"
        component={ProfessionalScheduleScreen}
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfessionalClients"
        component={ProfessionalClientsScreen}
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfessionalServices"
        component={ProfessionalServicesScreen}
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color, size }) => (
            <Icon name="spa" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          // Rotas de autenticação
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ title: 'Recuperar Senha' }}
            />
          </>
        ) : user.type === 'professional' ? (
          // Rotas do profissional
          <>
            <Stack.Screen
              name="ProfessionalMain"
              component={ProfessionalTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfessionalSettings"
              component={ProfessionalSettingsScreen}
              options={{ title: 'Configurações' }}
            />
          </>
        ) : (
          // Rotas do cliente
          <>
            <Stack.Screen
              name="ClientMain"
              component={ClientTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ServiceDetails"
              component={ServiceDetailsScreen}
              options={{ title: 'Detalhes do Serviço' }}
            />
            <Stack.Screen
              name="ProfessionalDetails"
              component={ProfessionalDetailsScreen}
              options={{ title: 'Detalhes do Profissional' }}
            />
            <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{ title: 'Agendar' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Configurações' }}
            />
            <Stack.Screen
              name="Support"
              component={SupportScreen}
              options={{ title: 'Suporte' }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: 'Notificações' }}
            />
            <Stack.Screen
              name="PaymentMethods"
              component={PaymentMethodsScreen}
              options={{ title: 'Formas de Pagamento' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 