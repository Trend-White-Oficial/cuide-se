import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Professional {
  id: string;
  name: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const AVAILABLE_DATES = ['2024-03-20', '2024-03-21', '2024-03-22'];

export const CreateAppointmentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      setError('Não foi possível carregar os serviços.');
    }
  }, []);

  const fetchProfessionals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name');

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      setError('Não foi possível carregar os profissionais.');
    }
  }, []);

  const fetchTimeSlots = useCallback(async () => {
    if (!selectedService || !selectedProfessional || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const { data: appointments } = await supabase
        .from('appointments')
        .select('time')
        .eq('professional_id', selectedProfessional)
        .eq('date', selectedDate)
        .eq('status', 'confirmed');

      const bookedTimes = new Set(appointments?.map(a => a.time) || []);
      const slots: TimeSlot[] = [];

      for (let hour = 9; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push({ time, available: !bookedTimes.has(time) });
        }
      }

      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      setError('Não foi possível carregar os horários disponíveis.');
    } finally {
      setLoading(false);
    }
  }, [selectedService, selectedProfessional, selectedDate]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchServices(), fetchProfessionals()]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [fetchServices, fetchProfessionals]);

  useEffect(() => {
    if (selectedService && selectedProfessional && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedService, selectedProfessional, selectedDate, fetchTimeSlots]);

  const handleCreateAppointment = useCallback(async () => {
    if (!user?.id || !selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .insert({
          client_id: user.id,
          service_id: selectedService,
          professional_id: selectedProfessional,
          date: selectedDate,
          time: selectedTime,
          status: 'pending',
        });

      if (error) throw error;

      Alert.alert(
        'Sucesso',
        'Agendamento criado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setError('Não foi possível criar o agendamento.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedService, selectedProfessional, selectedDate, selectedTime, navigation]);

  const isFormValid = useMemo(() => 
    Boolean(selectedService && selectedProfessional && selectedDate && selectedTime),
    [selectedService, selectedProfessional, selectedDate, selectedTime]
  );

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchServices} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Novo Agendamento</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Serviço</Text>
          <View style={styles.options}>
            {services.map(service => (
              <Button
                key={service.id}
                title={service.name}
                onPress={() => setSelectedService(service.id)}
                variant={selectedService === service.id ? 'primary' : 'outline'}
                style={styles.optionButton}
              />
            ))}
          </View>

          <Text style={styles.label}>Profissional</Text>
          <View style={styles.options}>
            {professionals.map(professional => (
              <Button
                key={professional.id}
                title={professional.name}
                onPress={() => setSelectedProfessional(professional.id)}
                variant={selectedProfessional === professional.id ? 'primary' : 'outline'}
                style={styles.optionButton}
              />
            ))}
          </View>

          <Text style={styles.label}>Data</Text>
          <View style={styles.options}>
            {AVAILABLE_DATES.map(date => (
              <Button
                key={date}
                title={date}
                onPress={() => setSelectedDate(date)}
                variant={selectedDate === date ? 'primary' : 'outline'}
                style={styles.optionButton}
              />
            ))}
          </View>

          {selectedDate && (
            <>
              <Text style={styles.label}>Horário</Text>
              <View style={styles.options}>
                {timeSlots.map(slot => (
                  <Button
                    key={slot.time}
                    title={slot.time}
                    onPress={() => setSelectedTime(slot.time)}
                    variant={selectedTime === slot.time ? 'primary' : 'outline'}
                    style={styles.optionButton}
                    disabled={!slot.available}
                  />
                ))}
              </View>
            </>
          )}

          <Button
            title="Criar Agendamento"
            onPress={handleCreateAppointment}
            style={styles.createButton}
            disabled={!isFormValid}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    minWidth: 100,
  },
  createButton: {
    marginTop: 24,
  },
}); 