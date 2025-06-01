import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface NotificationSettings {
  new_appointments: boolean;
  appointment_reminders: boolean;
  appointment_cancellations: boolean;
  new_reviews: boolean;
  marketing_updates: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
}

export const ProfessionalNotificationSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    new_appointments: true,
    appointment_reminders: true,
    appointment_cancellations: true,
    new_reviews: true,
    marketing_updates: false,
    push_notifications: true,
    email_notifications: true,
    sms_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('notification_settings')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.notification_settings) {
        setSettings(data.notification_settings);
      }
    } catch (err) {
      setError('Erro ao carregar configurações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleSetting = async (key: keyof NotificationSettings) => {
    try {
      setSaving(true);
      setError(null);

      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ notification_settings: newSettings })
        .eq('professional_id', user?.id);

      if (err) throw err;
      setSettings(newSettings);
    } catch (err) {
      setError('Erro ao atualizar configurações.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSettings} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações de Notificações" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Canais de Notificação"
            subtitle="Escolha como você quer receber as notificações"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Notificações Push"
              subtitle="Receber notificações no aplicativo"
              showBackButton={false}
            />
            <Switch
              value={settings.push_notifications}
              onValueChange={() => handleToggleSetting('push_notifications')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Notificações por Email"
              subtitle="Receber notificações por email"
              showBackButton={false}
            />
            <Switch
              value={settings.email_notifications}
              onValueChange={() => handleToggleSetting('email_notifications')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Notificações por SMS"
              subtitle="Receber notificações por SMS"
              showBackButton={false}
            />
            <Switch
              value={settings.sms_notifications}
              onValueChange={() => handleToggleSetting('sms_notifications')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Tipos de Notificação"
            subtitle="Escolha quais notificações você quer receber"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Novos Agendamentos"
              subtitle="Receber notificações quando novos agendamentos forem feitos"
              showBackButton={false}
            />
            <Switch
              value={settings.new_appointments}
              onValueChange={() => handleToggleSetting('new_appointments')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Lembretes de Agendamento"
              subtitle="Receber lembretes antes dos agendamentos"
              showBackButton={false}
            />
            <Switch
              value={settings.appointment_reminders}
              onValueChange={() => handleToggleSetting('appointment_reminders')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Cancelamentos"
              subtitle="Receber notificações quando agendamentos forem cancelados"
              showBackButton={false}
            />
            <Switch
              value={settings.appointment_cancellations}
              onValueChange={() => handleToggleSetting('appointment_cancellations')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Novas Avaliações"
              subtitle="Receber notificações quando receber novas avaliações"
              showBackButton={false}
            />
            <Switch
              value={settings.new_reviews}
              onValueChange={() => handleToggleSetting('new_reviews')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Atualizações de Marketing"
              subtitle="Receber notificações sobre novidades e promoções"
              showBackButton={false}
            />
            <Switch
              value={settings.marketing_updates}
              onValueChange={() => handleToggleSetting('marketing_updates')}
              disabled={saving}
            />
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
}); 