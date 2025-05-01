import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/contexts/AppContext';
import MainTabs from './components/MainTabs';
import AuthScreen from './src/screens/AuthScreen';
import ProfessionalProfileScreen from './src/screens/ProfessionalProfileScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import AppointmentConfirmationScreen from './src/screens/AppointmentConfirmationScreen';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

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

// Certifique-se de que este arquivo App.tsx está configurado para o ambiente mobile.

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
