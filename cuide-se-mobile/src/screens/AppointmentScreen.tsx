import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, TextInput, RadioButton } from 'react-native-paper';
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

type AppointmentScreenRouteProp = RouteProp<RootStackParamList, 'Appointment'>;
type AppointmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function AppointmentScreen() {
  const route = useRoute<AppointmentScreenRouteProp>();
  const navigation = useNavigation<AppointmentScreenNavigationProp>();
  const { professionalId, serviceId } = route.params;

  const [professional, setProfessional] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');

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
        <Text>Serviço não encontrado</Text>
      </View>
    );
  }

  const handleConfirmAppointment = () => {
    navigation.navigate('AppointmentConfirmation', {
      professionalId,
      serviceId,
      date: selectedDate,
      time: selectedTime,
      notes,
      paymentMethod,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.professionalName}>com {professional.name}</Text>
          <Text style={styles.servicePrice}>
            R$ {service.price.toFixed(2)}
          </Text>
          <Text style={styles.serviceDuration}>
            Duração: {service.duration} minutos
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Data e Hora</Text>
          <TextInput
            label="Data"
            value={selectedDate}
            onChangeText={setSelectedDate}
            style={styles.input}
            placeholder="DD/MM/AAAA"
          />
          <TextInput
            label="Horário"
            value={selectedTime}
            onChangeText={setSelectedTime}
            style={styles.input}
            placeholder="HH:MM"
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            label="Observações"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
            numberOfLines={4}
          />
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <RadioButton.Group
            onValueChange={value => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <RadioButton.Item label="Cartão de Crédito" value="credit" />
            <RadioButton.Item label="Cartão de Débito" value="debit" />
            <RadioButton.Item label="PIX" value="pix" />
          </RadioButton.Group>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleConfirmAppointment}
        style={styles.confirmButton}
        disabled={!selectedDate || !selectedTime}
      >
        Confirmar Agendamento
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  input: {
    marginBottom: 16,
  },
  confirmButton: {
    margin: 16,
    marginTop: 0,
  },
});