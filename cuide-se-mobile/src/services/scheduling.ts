import { supabase } from '../lib/supabase';
import { NotificationService } from './notifications';

export interface Appointment {
  id: string;
  user_id: string;
  professional_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export class SchedulingService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createAppointment(
    userId: string,
    professionalId: string,
    serviceId: string,
    date: string,
    startTime: string,
    notes?: string
  ): Promise<Appointment> {
    // Verificar disponibilidade
    const isAvailable = await this.checkAvailability(professionalId, date, startTime);
    if (!isAvailable) {
      throw new Error('Horário não disponível');
    }

    // Calcular horário de término
    const endTime = await this.calculateEndTime(serviceId, startTime);

    // Criar agendamento
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
          professional_id: professionalId,
          service_id: serviceId,
          date,
          start_time: startTime,
          end_time: endTime,
          status: 'scheduled',
          notes,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação
    await this.notificationService.sendAppointmentConfirmation(data);

    return data;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getProfessionalAppointments(professionalId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação de atualização
    await this.notificationService.sendAppointmentStatusUpdate(data);

    return data;
  }

  async cancelAppointment(appointmentId: string, reason?: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        notes: reason ? `Cancelado: ${reason}` : 'Cancelado pelo usuário',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação de cancelamento
    await this.notificationService.sendAppointmentCancellation(data);

    return data;
  }

  async getAvailableTimeSlots(
    professionalId: string,
    date: string
  ): Promise<TimeSlot[]> {
    // Buscar horários de trabalho do profissional
    const { data: schedule, error: scheduleError } = await supabase
      .from('professional_schedules')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('day_of_week', new Date(date).getDay())
      .single();

    if (scheduleError) throw scheduleError;

    // Buscar agendamentos existentes
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('date', date)
      .eq('status', 'scheduled');

    if (appointmentsError) throw appointmentsError;

    // Gerar slots de tempo disponíveis
    const timeSlots: TimeSlot[] = [];
    const startHour = parseInt(schedule.start_time.split(':')[0]);
    const endHour = parseInt(schedule.end_time.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

      const isAvailable = !appointments.some(
        (appointment) =>
          appointment.start_time <= startTime && appointment.end_time > startTime
      );

      timeSlots.push({
        start_time: startTime,
        end_time: endTime,
        available: isAvailable,
      });
    }

    return timeSlots;
  }

  private async checkAvailability(
    professionalId: string,
    date: string,
    startTime: string
  ): Promise<boolean> {
    const timeSlots = await this.getAvailableTimeSlots(professionalId, date);
    return timeSlots.some(
      (slot) => slot.start_time === startTime && slot.available
    );
  }

  private async calculateEndTime(
    serviceId: string,
    startTime: string
  ): Promise<string> {
    // Buscar duração do serviço
    const { data: service, error } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (error) throw error;

    // Calcular horário de término
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + service.duration, 0);

    return endDate.toTimeString().slice(0, 5);
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newStartTime: string
  ): Promise<Appointment> {
    // Verificar disponibilidade do novo horário
    const appointment = await this.getAppointmentById(appointmentId);
    const isAvailable = await this.checkAvailability(
      appointment.professional_id,
      newDate,
      newStartTime
    );

    if (!isAvailable) {
      throw new Error('Novo horário não disponível');
    }

    // Calcular novo horário de término
    const newEndTime = await this.calculateEndTime(
      appointment.service_id,
      newStartTime
    );

    // Atualizar agendamento
    const { data, error } = await supabase
      .from('appointments')
      .update({
        date: newDate,
        start_time: newStartTime,
        end_time: newEndTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação de reagendamento
    await this.notificationService.sendAppointmentRescheduling(data);

    return data;
  }

  async getAppointmentById(appointmentId: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (error) throw error;
    return data;
  }

  async confirmAppointment(appointmentId: string, confirmerRole: 'user' | 'professional'): Promise<Appointment> {
    // Atualiza status para 'confirmed'
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;

    // Envia notificação de confirmação
    await this.notificationService.sendAppointmentConfirmation(data, confirmerRole);

    return data;
  }
} 