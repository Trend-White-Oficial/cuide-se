import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface NotificationSettings {
  appointment_reminders: boolean;
  promotions: boolean;
  system_updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export const NotificationSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    appointment_reminders: true,
    promotions: true,
    system_updates: true,
    email_notifications: true,
    push_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      setError('Erro ao carregar configurações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting: keyof NotificationSettings) => {
    try {
      setError(null);
      const newSettings = {
        ...settings,
        [setting]: !settings[setting],
      };

      const { error: updateError } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user?.id,
          ...newSettings,
        });

      if (updateError) throw updateError;
      setSettings(newSettings);
    } catch (err) {
      setError('Erro ao atualizar configurações.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Header title="Tipos de Notificações" showBackButton={false} />
          <Button
            title={`Lembretes de Agendamento: ${settings.appointment_reminders ? 'Ativado' : 'Desativado'}`}
            onPress={() => handleToggleSetting('appointment_reminders')}
            variant={settings.appointment_reminders ? 'contained' : 'outline'}
            style={styles.button}
          />
          <Button
            title={`Promoções: ${settings.promotions ? 'Ativado' : 'Desativado'}`}
            onPress={() => handleToggleSetting('promotions')}
            variant={settings.promotions ? 'contained' : 'outline'}
            style={styles.button}
          />
          <Button
            title={`Atualizações do Sistema: ${settings.system_updates ? 'Ativado' : 'Desativado'}`}
            onPress={() => handleToggleSetting('system_updates')}
            variant={settings.system_updates ? 'contained' : 'outline'}
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Canais de Notificação" showBackButton={false} />
          <Button
            title={`Notificações por E-mail: ${settings.email_notifications ? 'Ativado' : 'Desativado'}`}
            onPress={() => handleToggleSetting('email_notifications')}
            variant={settings.email_notifications ? 'contained' : 'outline'}
            style={styles.button}
          />
          <Button
            title={`Notificações Push: ${settings.push_notifications ? 'Ativado' : 'Desativado'}`}
            onPress={() => handleToggleSetting('push_notifications')}
            variant={settings.push_notifications ? 'contained' : 'outline'}
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
  button: {
    marginBottom: 12,
  },
}); 