import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface BackupSettings {
  auto_backup: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_time: string;
  include_photos: boolean;
  include_documents: boolean;
  cloud_storage: boolean;
}

export const ProfessionalBackupSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BackupSettings>({
    auto_backup: true,
    backup_frequency: 'daily',
    backup_time: '00:00',
    include_photos: true,
    include_documents: true,
    cloud_storage: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupSize, setBackupSize] = useState<string>('0 MB');

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('backup_settings, last_backup, backup_size')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.backup_settings) {
        setSettings(data.backup_settings);
      }
      if (data?.last_backup) {
        setLastBackup(data.last_backup);
      }
      if (data?.backup_size) {
        setBackupSize(data.backup_size);
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

  const handleToggleSetting = async (key: keyof BackupSettings) => {
    try {
      setSaving(true);
      setError(null);

      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ backup_settings: newSettings })
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

  const handleBackupNow = async () => {
    try {
      setSaving(true);
      setError(null);

      // TODO: Implementar lógica de backup
      console.log('Iniciando backup...');

      // Simular backup
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const now = new Date().toISOString();
      const { error: err } = await supabase
        .from('professional_settings')
        .update({
          last_backup: now,
          backup_size: '2.5 MB',
        })
        .eq('professional_id', user?.id);

      if (err) throw err;
      setLastBackup(now);
      setBackupSize('2.5 MB');
    } catch (err) {
      setError('Erro ao realizar backup.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreBackup = async () => {
    try {
      setSaving(true);
      setError(null);

      // TODO: Implementar lógica de restauração
      console.log('Iniciando restauração...');

      // Simular restauração
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      setError('Erro ao restaurar backup.');
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
      <Header title="Configurações de Backup" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Backup Automático"
            subtitle="Configure o backup automático dos seus dados"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Ativar Backup Automático"
              subtitle="Realiza backup periodicamente"
              showBackButton={false}
            />
            <Switch
              value={settings.auto_backup}
              onValueChange={() => handleToggleSetting('auto_backup')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Armazenamento em Nuvem"
              subtitle="Salva backup na nuvem"
              showBackButton={false}
            />
            <Switch
              value={settings.cloud_storage}
              onValueChange={() => handleToggleSetting('cloud_storage')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Conteúdo do Backup"
            subtitle="Selecione o que será incluído no backup"
            showBackButton={false}
          />
          <View style={styles.settingContainer}>
            <Header
              title="Incluir Fotos"
              subtitle="Backup de imagens e fotos"
              showBackButton={false}
            />
            <Switch
              value={settings.include_photos}
              onValueChange={() => handleToggleSetting('include_photos')}
              disabled={saving}
            />
          </View>

          <View style={styles.settingContainer}>
            <Header
              title="Incluir Documentos"
              subtitle="Backup de documentos e arquivos"
              showBackButton={false}
            />
            <Switch
              value={settings.include_documents}
              onValueChange={() => handleToggleSetting('include_documents')}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header
            title="Último Backup"
            subtitle={`Realizado em: ${lastBackup || 'Nunca'}`}
            showBackButton={false}
          />
          <Header
            title={`Tamanho: ${backupSize}`}
            showBackButton={false}
          />
          <Button
            title="Fazer Backup Agora"
            onPress={handleBackupNow}
            loading={saving}
            style={styles.button}
          />
          <Button
            title="Restaurar Backup"
            onPress={handleRestoreBackup}
            loading={saving}
            variant="secondary"
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
}); 