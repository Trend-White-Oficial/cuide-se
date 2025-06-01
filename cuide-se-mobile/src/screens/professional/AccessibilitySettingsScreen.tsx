import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface AccessibilitySettings {
  high_contrast: boolean;
  large_text: boolean;
  screen_reader: boolean;
  reduce_motion: boolean;
  bold_text: boolean;
  color_blind_mode: boolean;
}

export const ProfessionalAccessibilitySettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    high_contrast: false,
    large_text: false,
    screen_reader: false,
    reduce_motion: false,
    bold_text: false,
    color_blind_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('accessibility_settings')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.accessibility_settings) {
        setSettings(data.accessibility_settings);
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

  const handleToggleSetting = async (key: keyof AccessibilitySettings) => {
    try {
      setSaving(true);
      setError(null);

      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ accessibility_settings: newSettings })
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
      <Header title="Configurações de Acessibilidade" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Visual"
            subtitle="Ajustes visuais para melhorar a experiência"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Alto Contraste"
              subtitle="Aumenta o contraste das cores"
              showBackButton={false}
            />
            <Switch
              value={settings.high_contrast}
              onValueChange={() => handleToggleSetting('high_contrast')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Texto Grande"
              subtitle="Aumenta o tamanho do texto"
              showBackButton={false}
            />
            <Switch
              value={settings.large_text}
              onValueChange={() => handleToggleSetting('large_text')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Texto em Negrito"
              subtitle="Torna o texto mais espesso"
              showBackButton={false}
            />
            <Switch
              value={settings.bold_text}
              onValueChange={() => handleToggleSetting('bold_text')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Modo Daltônico"
              subtitle="Ajusta as cores para daltônicos"
              showBackButton={false}
            />
            <Switch
              value={settings.color_blind_mode}
              onValueChange={() => handleToggleSetting('color_blind_mode')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Navegação"
            subtitle="Ajustes para melhorar a navegação"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Leitor de Tela"
              subtitle="Otimiza para leitores de tela"
              showBackButton={false}
            />
            <Switch
              value={settings.screen_reader}
              onValueChange={() => handleToggleSetting('screen_reader')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Reduzir Movimento"
              subtitle="Diminui animações e transições"
              showBackButton={false}
            />
            <Switch
              value={settings.reduce_motion}
              onValueChange={() => handleToggleSetting('reduce_motion')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Ajuda"
            subtitle="Recursos adicionais de acessibilidade"
            showBackButton={false}
          />
          <View style={styles.helpContainer}>
            <Header
              title="Guia de Acessibilidade"
              subtitle="Saiba mais sobre os recursos disponíveis"
              showBackButton={false}
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
  helpContainer: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 8,
  },
}); 