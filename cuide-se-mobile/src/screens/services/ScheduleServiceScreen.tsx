import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../hooks/useServices';
import { useAppointments } from '../../hooks/useAppointments';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { DatePicker } from '../../components/DatePicker';
import { Icon } from '../../components/Icon';
import { Divider } from '../../components/Divider';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00',
];

export const ScheduleServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId } = route.params as { serviceId: string };
  const { getServiceById, isLoading: isServiceLoading } = useServices();
  const { createAppointment, isLoading: isAppointmentLoading } = useAppointments();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const service = getServiceById(serviceId);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSchedule = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        throw new Error(t('appointments.selectDateTime'));
      }

      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes);

      await createAppointment({
        serviceId,
        date: appointmentDate,
      });

      navigation.navigate('AppointmentConfirmation', {
        serviceId,
        date: appointmentDate,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t('appointments.error'));
    }
  };

  if (isServiceLoading || isAppointmentLoading) {
    return <Loading />;
  }

  if (!service) {
    return <ErrorMessage message={t('services.notFound')} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('appointments.schedule')}</Text>
          <Text style={styles.subtitle}>{service.name}</Text>
        </View>

        <View style={styles.content}>
          {error && (
            <ErrorMessage message={error} style={styles.error} />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('appointments.selectDate')}
            </Text>
            <DatePicker
              value={selectedDate}
              onChange={handleDateSelect}
              minimumDate={new Date()}
            />
          </View>

          <Divider />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('appointments.selectTime')}
            </Text>
            <View style={styles.timeSlots}>
              {TIME_SLOTS.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider />

          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Icon name="clock" size={20} />
              <Text style={styles.summaryText}>
                {service.duration} {t('services.minutes')}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="dollar-sign" size={20} />
              <Text style={styles.summaryText}>
                R$ {service.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('appointments.confirm')}
          onPress={handleSchedule}
          disabled={!selectedDate || !selectedTime}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  error: {
    marginBottom: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 16,
  },
  selectedTimeSlotText: {
    color: '#FFF',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
  },
}); 