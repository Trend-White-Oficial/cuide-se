import NotificationService from './NotificationService';
import { addHours, addDays, isBefore } from 'date-fns';

class ReminderService {
  constructor() {
    this.reminders = new Map();
  }

  // Configurações padrão de lembretes
  static defaultReminderSettings = {
    channels: ['email', 'sms', 'push'],
    intervals: [
      { value: 24, unit: 'hours', label: '24 horas antes' },
      { value: 2, unit: 'hours', label: '2 horas antes' },
      { value: 30, unit: 'minutes', label: '30 minutos antes' }
    ]
  };

  // Calcula o horário do lembrete baseado no intervalo
  calculateReminderTime(appointmentDate, interval) {
    const { value, unit } = interval;
    switch (unit) {
      case 'hours':
        return addHours(appointmentDate, -value);
      case 'days':
        return addDays(appointmentDate, -value);
      case 'minutes':
        return addHours(appointmentDate, -value / 60);
      default:
        return appointmentDate;
    }
  }

  // Agenda um lembrete
  async scheduleReminder(appointment, settings = ReminderService.defaultReminderSettings) {
    const { intervals, channels } = settings;
    
    for (const interval of intervals) {
      const reminderTime = this.calculateReminderTime(new Date(appointment.date), interval);
      
      // Não agenda lembretes para horários passados
      if (isBefore(reminderTime, new Date())) {
        continue;
      }

      const reminderId = `${appointment.id}-${interval.value}-${interval.unit}`;
      
      // Agenda o lembrete
      const timeoutId = setTimeout(async () => {
        await this.sendReminder(appointment, interval, channels);
        this.reminders.delete(reminderId);
      }, reminderTime.getTime() - Date.now());

      this.reminders.set(reminderId, {
        timeoutId,
        appointment,
        interval,
        channels
      });
    }
  }

  // Envia o lembrete
  async sendReminder(appointment, interval, channels) {
    const reminderMessage = {
      subject: 'Lembrete de Agendamento - Cuide-se',
      body: `Lembrete: Você tem um agendamento em ${interval.label} para ${appointment.service.name} com ${appointment.professional.name}.`
    };

    return NotificationService.sendConfirmation(
      { ...appointment, reminderMessage },
      channels
    );
  }

  // Cancela todos os lembretes de um agendamento
  cancelReminders(appointmentId) {
    for (const [reminderId, reminder] of this.reminders.entries()) {
      if (reminderId.startsWith(appointmentId)) {
        clearTimeout(reminder.timeoutId);
        this.reminders.delete(reminderId);
      }
    }
  }

  // Atualiza as configurações de lembrete
  async updateReminderSettings(appointmentId, newSettings) {
    // Cancela lembretes existentes
    this.cancelReminders(appointmentId);
    
    // Busca o agendamento
    const appointment = await this.getAppointment(appointmentId);
    
    // Agenda novos lembretes com as novas configurações
    await this.scheduleReminder(appointment, newSettings);
  }

  // Busca um agendamento (simulado - deve ser implementado com sua lógica de banco de dados)
  async getAppointment(appointmentId) {
    // Implementar busca no banco de dados
    return {
      id: appointmentId,
      // ... outros dados do agendamento
    };
  }
}

export default new ReminderService(); 