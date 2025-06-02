import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from '../components/Calendar';
import { AppointmentForm } from '../components/AppointmentForm';
import { Appointment, TimeSlot } from '../services/scheduling';
import { useNavigation, useRoute } from '@react-navigation/native';

export const AppointmentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, professionalId, serviceId } = route.params as {
    userId: string;
    professionalId: string;
    serviceId: string;
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(undefined);
    setShowForm(false);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowForm(true);
  };

  const handleAppointmentSuccess = (appointment: Appointment) => {
    navigation.navigate('AppointmentDetails', { appointmentId: appointment.id });
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTimeSlot(undefined);
  };

  return (
    <View style={styles.container}>
      <Calendar
        professionalId={professionalId}
        onDateSelect={handleDateSelect}
        onTimeSlotSelect={handleTimeSlotSelect}
      />
      {showForm && (
        <AppointmentForm
          userId={userId}
          professionalId={professionalId}
          serviceId={serviceId}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSuccess={handleAppointmentSuccess}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});