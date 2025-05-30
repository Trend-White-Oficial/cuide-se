import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, TextInput, RadioButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleConfirm = () => {
    navigation.navigate('AppointmentConfirmation', {
      professionalId,
      serviceId,
      date: date.toISOString(),
      time: time.toISOString(),
      notes,
      paymentMethod: 'cartão',
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
          <Text style={styles.sectionTitle}>Selecione a Data e Hora</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.button}
          >
            Data: {date.toLocaleDateString()}
          </Button>

          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.button}
          >
            Hora: {time.toLocaleTimeString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              onChange={handleTimeChange}
            />
          )}
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

      <Button
        mode="contained"
        onPress={handleConfirm}
        style={styles.confirmButton}
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
  button: {
    marginVertical: 8,
  },
  confirmButton: {
    margin: 16,
    marginTop: 0,
  },
});