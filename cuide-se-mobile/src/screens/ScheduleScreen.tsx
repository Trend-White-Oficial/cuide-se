import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Professional, Service } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RouteParams {
  professional?: Professional;
  service?: Service;
}

export const ScheduleScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { professional, service } = route.params as RouteParams;
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>(professional);
  const [selectedService, setSelectedService] = useState<Service | undefined>(service);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSchedule = async () => {
    if (!selectedProfessional || !selectedService) {
      setError('Por favor, selecione um profissional e um serviço.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const { data, error: scheduleError } = await supabase
        .from('appointments')
        .insert([
          {
            professional_id: selectedProfessional.id,
            service_id: selectedService.id,
            date: selectedDate.toISOString(),
            time: selectedTime.toISOString(),
          },
        ]);

      if (scheduleError) throw scheduleError;

      navigation.navigate('Appointments');
    } catch (err) {
      setError('Erro ao agendar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Agendando..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Agendar" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Data" showBackButton={false} />
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => date && setSelectedDate(date)}
          />
        </View>

        <View style={styles.section}>
          <Header title="Horário" showBackButton={false} />
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={(event, time) => time && setSelectedTime(time)}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar Agendamento"
            onPress={handleSchedule}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  errorContainer: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    width: '100%',
  },
}); 