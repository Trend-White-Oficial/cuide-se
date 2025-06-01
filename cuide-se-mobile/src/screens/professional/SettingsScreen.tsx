import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface Settings {
  notifications: {
    new_appointments: boolean;
    appointment_reminders: boolean;
    client_messages: boolean;
    marketing: boolean;
  };
  privacy: {
    show_phone: boolean;
    show_email: boolean;
    show_address: boolean;
  };
  availability: {
    auto_confirm: boolean;
    min_notice_hours: number;
    max_daily_appointments: number;
  };
}

export const ProfessionalSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('*')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      setSettings(data);
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

  const handleUpdateSettings = async (newSettings: Settings) => {
    try {
      const { error: err } = await supabase
        .from('professional_settings')
        .update(newSettings)
        .eq('professional_id', user?.id);

      if (err) throw err;
      setSettings(newSettings);
    } catch (err) {
      setError('Erro ao atualizar configurações.');
      console.error(err);
    }
  };

  const handleToggleNotification = (key: keyof Settings['notifications']) => {
    if (!settings) return;
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    handleUpdateSettings(newSettings);
  };

  const handleTogglePrivacy = (key: keyof Settings['privacy']) => {
    if (!settings) return;
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    };
    handleUpdateSettings(newSettings);
  };

  const handleToggleAvailability = (key: keyof Settings['availability']) => {
    if (!settings) return;
    const newSettings = {
      ...settings,
      availability: {
        ...settings.availability,
        [key]: !settings.availability[key],
      },
    };
    handleUpdateSettings(newSettings);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSettings} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Notificações" showBackButton={false} />
          <View style={styles.settingItem}>
            <Header
              title="Novos Agendamentos"
              subtitle="Receber notificações de novos agendamentos"
              showBackButton={false}
            />
            <Switch
              value={settings?.notifications.new_appointments}
              onValueChange={() => handleToggleNotification('new_appointments')}
            />
          </View>
          <View style={styles.settingItem}>
            <Header
              title="Lembretes"
              subtitle="Receber lembretes de agendamentos"
              showBackButton={false}
            />
            <Switch
              value={settings?.notifications.appointment_reminders}
              onValueChange={() => handleToggleNotification('appointment_reminders')}
            />
          </View>
          <View style={styles.settingItem}>
            <Header
              title="Mensagens"
              subtitle="Receber notificações de mensagens"
              showBackButton={false}
            />
            <Switch
              value={settings?.notifications.client_messages}
              onValueChange={() => handleToggleNotification('client_messages')}
            />
          </View>
          <View style={styles.settingItem}>
            <Header
              title="Marketing"
              subtitle="Receber novidades e promoções"
              showBackButton={false}
            />
            <Switch
              value={settings?.notifications.marketing}
              onValueChange={() => handleToggleNotification('marketing')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header title="Privacidade" showBackButton={false} />
          <View style={styles.settingItem}>
            <Header
              title="Telefone"
              subtitle="Mostrar telefone para clientes"
              showBackButton={false}
            />
            <Switch
              value={settings?.privacy.show_phone}
              onValueChange={() => handleTogglePrivacy('show_phone')}
            />
          </View>
          <View style={styles.settingItem}>
            <Header
              title="Email"
              subtitle="Mostrar email para clientes"
              showBackButton={false}
            />
            <Switch
              value={settings?.privacy.show_email}
              onValueChange={() => handleTogglePrivacy('show_email')}
            />
          </View>
          <View style={styles.settingItem}>
            <Header
              title="Endereço"
              subtitle="Mostrar endereço para clientes"
              showBackButton={false}
            />
            <Switch
              value={settings?.privacy.show_address}
              onValueChange={() => handleTogglePrivacy('show_address')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header title="Disponibilidade" showBackButton={false} />
          <View style={styles.settingItem}>
            <Header
              title="Confirmação Automática"
              subtitle="Confirmar agendamentos automaticamente"
              showBackButton={false}
            />
            <Switch
              value={settings?.availability.auto_confirm}
              onValueChange={() => handleToggleAvailability('auto_confirm')}
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
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
}); 