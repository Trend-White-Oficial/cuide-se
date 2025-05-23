import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

// Função para buscar dados do profissional e serviço
async function fetchProfessionalAndService(professionalId: string, serviceId: string) {
  const response = await fetch(`https://api.cuide-se.com/professionals/${professionalId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do profissional');
  }
  const professional = await response.json();
  const service = professional.services.find((s: any) => s.id === serviceId);
  if (!service) {
    throw new Error('Serviço não encontrado');
  }
  return { professional, service };
}

type AppointmentConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'AppointmentConfirmation'>;
type AppointmentConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function AppointmentConfirmationScreen() {
  const route = useRoute<AppointmentConfirmationScreenRouteProp>();
  const navigation = useNavigation<AppointmentConfirmationScreenNavigationProp>();
  const { professionalId, serviceId, date, time, notes, paymentMethod } = route.params;

  const [professional, setProfessional] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfessionalAndService() {
      try {
        const { professional, service } = await fetchProfessionalAndService(professionalId, serviceId);
        setProfessional(professional);
        setService(service);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfessionalAndService();
  }, [professionalId, serviceId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erro: {error}</Text>
      </View>
    );
  }

  if (!professional || !service) {
    return (
      <View style={styles.container}>
        <Text>Agendamento não encontrado</Text>
      </View>
    );
  }

  const handleGoToHome = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <IconButton
          icon="check-circle"
          size={80}
          iconColor={theme.colors.primary}
        />
      </View>

      <Text style={styles.title}>Agendamento Confirmado!</Text>
      <Text style={styles.subtitle}>
        Seu agendamento foi realizado com sucesso
      </Text>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text style={styles.detailsTitle}>Detalhes do Agendamento</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Serviço:</Text>
            <Text style={styles.detailValue}>{service.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Profissional:</Text>
            <Text style={styles.detailValue}>{professional.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Data:</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Horário:</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valor:</Text>
            <Text style={styles.detailValue}>
              R$ {service.price.toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pagamento:</Text>
            <Text style={styles.detailValue}>
              {paymentMethod === 'credit' && 'Cartão de Crédito'}
              {paymentMethod === 'debit' && 'Cartão de Débito'}
              {paymentMethod === 'pix' && 'PIX'}
            </Text>
          </View>

          {notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.detailLabel}>Observações:</Text>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleGoToHome}
        style={styles.homeButton}
      >
        Voltar para o Início
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 16,
  },
  notesText: {
    fontSize: 16,
    marginTop: 8,
  },
  homeButton: {
    marginTop: 'auto',
  },
});