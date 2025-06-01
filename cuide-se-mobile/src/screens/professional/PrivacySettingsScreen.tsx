import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface PrivacySettings {
  show_phone: boolean;
  show_email: boolean;
  show_address: boolean;
  show_rating: boolean;
  show_reviews: boolean;
  show_schedule: boolean;
  allow_messages: boolean;
  allow_photos: boolean;
  data_collection: boolean;
  analytics: boolean;
  personalized_ads: boolean;
}

export const ProfessionalPrivacySettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    show_phone: true,
    show_email: true,
    show_address: true,
    show_rating: true,
    show_reviews: true,
    show_schedule: true,
    allow_messages: true,
    allow_photos: true,
    data_collection: true,
    analytics: true,
    personalized_ads: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('privacy_settings')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.privacy_settings) {
        setSettings(data.privacy_settings);
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

  const handleToggleSetting = async (key: keyof PrivacySettings) => {
    try {
      setSaving(true);
      setError(null);

      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ privacy_settings: newSettings })
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
      <Header title="Configurações de Privacidade" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Informações Pessoais"
            subtitle="Controle quais informações são exibidas no seu perfil"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Telefone"
              subtitle="Exibir número de telefone no perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.show_phone}
              onValueChange={() => handleToggleSetting('show_phone')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Email"
              subtitle="Exibir email no perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.show_email}
              onValueChange={() => handleToggleSetting('show_email')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Endereço"
              subtitle="Exibir endereço no perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.show_address}
              onValueChange={() => handleToggleSetting('show_address')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Avaliações e Agendamentos"
            subtitle="Controle a visibilidade das suas avaliações e agenda"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Avaliação"
              subtitle="Exibir nota média no perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.show_rating}
              onValueChange={() => handleToggleSetting('show_rating')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Avaliações"
              subtitle="Exibir avaliações no perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.show_reviews}
              onValueChange={() => handleToggleSetting('show_reviews')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Mostrar Agenda"
              subtitle="Exibir horários disponíveis"
              showBackButton={false}
            />
            <Switch
              value={settings.show_schedule}
              onValueChange={() => handleToggleSetting('show_schedule')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Interações"
            subtitle="Controle como os clientes podem interagir com você"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Permitir Mensagens"
              subtitle="Receber mensagens de clientes"
              showBackButton={false}
            />
            <Switch
              value={settings.allow_messages}
              onValueChange={() => handleToggleSetting('allow_messages')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Permitir Fotos"
              subtitle="Receber fotos de clientes"
              showBackButton={false}
            />
            <Switch
              value={settings.allow_photos}
              onValueChange={() => handleToggleSetting('allow_photos')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Dados e Análises"
            subtitle="Controle como seus dados são utilizados"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Coleta de Dados"
              subtitle="Permitir coleta de dados para melhorar o serviço"
              showBackButton={false}
            />
            <Switch
              value={settings.data_collection}
              onValueChange={() => handleToggleSetting('data_collection')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Análises"
              subtitle="Permitir análise de uso do aplicativo"
              showBackButton={false}
            />
            <Switch
              value={settings.analytics}
              onValueChange={() => handleToggleSetting('analytics')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Anúncios Personalizados"
              subtitle="Receber anúncios baseados no seu perfil"
              showBackButton={false}
            />
            <Switch
              value={settings.personalized_ads}
              onValueChange={() => handleToggleSetting('personalized_ads')}
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