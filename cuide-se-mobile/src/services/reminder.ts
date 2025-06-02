import { supabase } from '../lib/supabase';
import { NotificationService } from './notifications';

export interface Reminder {
  id: string;
  appointment_id: string;
  user_id: string;
  professional_id: string;
  reminder_time: string;
  channels: string[];
  message: string;
  created_at: string;
  updated_at: string;
}

export class ReminderService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async createReminder(appointmentId: string, reminderTime: string, channels: string[], message: string): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .insert([
        {
          appointment_id: appointmentId,
          reminder_time: reminderTime,
          channels,
          message,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Enviar notificação de lembrete
    await this.notificationService.sendReminder(data);

    return data;
  }

  async getReminders(appointmentId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('appointment_id', appointmentId);

    if (error) throw error;
    return data;
  }

  async cancelReminder(reminderId: string): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId);

    if (error) throw error;
  }
} 