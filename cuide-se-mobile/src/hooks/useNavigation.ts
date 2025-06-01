import { useCallback } from 'react';
import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const useNavigation = () => {
  const navigation = useReactNavigation<NavigationProp>();

  // Navegação para a tela inicial
  const goToHome = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  // Navegação para a tela de perfil
  const goToProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  // Navegação para a tela de agendamentos
  const goToAppointments = useCallback(() => {
    navigation.navigate('Appointments');
  }, [navigation]);

  // Navegação para a tela de serviços
  const goToServices = useCallback(() => {
    navigation.navigate('Services');
  }, [navigation]);

  // Navegação para a tela de profissionais
  const goToProfessionals = useCallback(() => {
    navigation.navigate('Professionals');
  }, [navigation]);

  // Navegação para a tela de detalhes do serviço
  const goToServiceDetails = useCallback((serviceId: string) => {
    navigation.navigate('ServiceDetails', { serviceId });
  }, [navigation]);

  // Navegação para a tela de detalhes do profissional
  const goToProfessionalDetails = useCallback((professionalId: string) => {
    navigation.navigate('ProfessionalDetails', { professionalId });
  }, [navigation]);

  // Navegação para a tela de agendamento
  const goToSchedule = useCallback((serviceId: string, professionalId: string) => {
    navigation.navigate('Schedule', { serviceId, professionalId });
  }, [navigation]);

  // Navegação para a tela de detalhes do agendamento
  const goToAppointmentDetails = useCallback((appointmentId: string) => {
    navigation.navigate('AppointmentDetails', { appointmentId });
  }, [navigation]);

  // Navegação para a tela de avaliação
  const goToReview = useCallback((appointmentId: string) => {
    navigation.navigate('Review', { appointmentId });
  }, [navigation]);

  // Navegação para a tela de configurações
  const goToSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  // Navegação para a tela de ajuda
  const goToHelp = useCallback(() => {
    navigation.navigate('Help');
  }, [navigation]);

  // Navegação para a tela de sobre
  const goToAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  // Navegação para a tela de login
  const goToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // Navegação para a tela de cadastro
  const goToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  // Navegação para a tela de recuperação de senha
  const goToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  // Volta para a tela anterior
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    navigation,
    goToHome,
    goToProfile,
    goToAppointments,
    goToServices,
    goToProfessionals,
    goToServiceDetails,
    goToProfessionalDetails,
    goToSchedule,
    goToAppointmentDetails,
    goToReview,
    goToSettings,
    goToHelp,
    goToAbout,
    goToLogin,
    goToSignUp,
    goToForgotPassword,
    goBack,
  };
}; 