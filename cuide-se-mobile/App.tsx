import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppProvider } from './src/contexts/AppContext';

// Importação das telas
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfessionalProfileScreen from './src/screens/ProfessionalProfileScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import AppointmentConfirmationScreen from './src/screens/AppointmentConfirmationScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import AuthScreen from './src/screens/AuthScreen';

// Tipos para navegação
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  ProfessionalProfile: { id: string };
  Appointment: { professionalId: string; serviceId: string };
  AppointmentConfirmation: {
    professionalId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
    paymentMethod: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Configuração do cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos
      retry: 2,
    },
  },
});

// Navegação principal com tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="home" size={size} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="magnify" size={size} iconColor={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={UserProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="account" size={size} iconColor={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen 
                  name="ProfessionalProfile" 
                  component={ProfessionalProfileScreen}
                  options={{ headerShown: true, title: 'Perfil do Profissional' }}
                />
                <Stack.Screen 
                  name="Appointment" 
                  component={AppointmentScreen}
                  options={{ headerShown: true, title: 'Agendar Horário' }}
                />
                <Stack.Screen 
                  name="AppointmentConfirmation" 
                  component={AppointmentConfirmationScreen}
                  options={{ 
                    headerShown: true,
                    title: 'Confirmação',
                    headerLeft: () => null,
                  }}
                />
              </Stack.Navigator>
              <Toast />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </AppProvider>
    </QueryClientProvider>
  );
} 