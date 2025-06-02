import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { SchedulingService, Appointment, TimeSlot } from '../services/scheduling';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarProps {
  userId?: string;
  professionalId?: string;
  onDateSelect?: (date: string) => void;
  onTimeSlotSelect?: (timeSlot: TimeSlot) => void;
  onAppointmentSelect?: (appointment: Appointment) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  userId,
  professionalId,
  onDateSelect,
  onTimeSlotSelect,
  onAppointmentSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const schedulingService = new SchedulingService();

  useEffect(() => {
    loadAppointments();
  }, [userId, professionalId]);

  useEffect(() => {
    if (professionalId) {
      loadTimeSlots();
    }
  }, [selectedDate, professionalId]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let data: Appointment[];
      if (userId) {
        data = await schedulingService.getAppointments(userId);
      } else if (professionalId) {
        data = await schedulingService.getProfessionalAppointments(professionalId);
      } else {
        data = [];
      }
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const slots = await schedulingService.getAvailableTimeSlots(
        professionalId!,
        selectedDate
      );
      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    onTimeSlotSelect?.(timeSlot);
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    onAppointmentSelect?.(appointment);
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    appointments.forEach((appointment) => {
      const date = appointment.date;
      if (!marked[date]) {
        marked[date] = {
          marked: true,
          dotColor: getStatusColor(appointment.status),
        };
      }
    });
    return marked;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return '#2196F3';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const renderTimeSlots = () => {
    if (!professionalId) return null;

    return (
      <View style={styles.timeSlotsContainer}>
        <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                !slot.available && styles.timeSlotUnavailable,
              ]}
              onPress={() => slot.available && handleTimeSlotSelect(slot)}
              disabled={!slot.available}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  !slot.available && styles.timeSlotTextUnavailable,
                ]}
              >
                {slot.start_time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderAppointments = () => {
    const dayAppointments = appointments.filter((appointment) =>
      isSameDay(parseISO(appointment.date), parseISO(selectedDate))
    );

    if (dayAppointments.length === 0) {
      return (
        <View style={styles.noAppointments}>
          <Text style={styles.noAppointmentsText}>
            Nenhum agendamento para esta data
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.appointmentsContainer}>
        <Text style={styles.sectionTitle}>Agendamentos do Dia</Text>
        {dayAppointments.map((appointment) => (
          <TouchableOpacity
            key={appointment.id}
            style={styles.appointmentCard}
            onPress={() => handleAppointmentSelect(appointment)}
          >
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentTime}>
                {format(parseISO(appointment.start_time), 'HH:mm')} -{' '}
                {format(parseISO(appointment.end_time), 'HH:mm')}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(appointment.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(appointment.status)}
                </Text>
              </View>
            </View>
            {appointment.notes && (
              <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        current={selectedDate}
        onDayPress={(day) => handleDateSelect(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: '#2196F3',
          selectedDayBackgroundColor: '#2196F3',
          selectedDayTextColor: '#FFFFFF',
          dotColor: '#2196F3',
        }}
        locale="pt-BR"
      />
      {renderTimeSlots()}
      {renderAppointments()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  timeSlotsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotUnavailable: {
    backgroundColor: '#EEEEEE',
  },
  timeSlotText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  timeSlotTextUnavailable: {
    color: '#9E9E9E',
  },
  appointmentsContainer: {
    padding: 16,
  },
  noAppointments: {
    padding: 16,
    alignItems: 'center',
  },
  noAppointmentsText: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentNotes: {
    color: '#666666',
    fontSize: 14,
    marginTop: 8,
  },
}); 