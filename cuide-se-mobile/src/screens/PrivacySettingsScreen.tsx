import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Header } from '../components/ui/Header';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface PrivacySettings {
  profile_visibility: 'public' | 'private';
  share_activity: boolean;
  share_location: boolean;
  share_ratings: boolean;
}

export const PrivacySettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    share_activity: true,
    share_location: true,
    share_ratings: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('privacy_settings')
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

  const handleUpdateSettings = async (newSettings: PrivacySettings) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('privacy_settings')
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

  const handleDeleteData = async () => {
    Alert.alert(
      'Excluir Dados',
      'Tem certeza que deseja excluir todos os seus dados? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setError(null);
              setLoading(true);

              const { error: deleteError } = await supabase
                .from('user_data')
                .delete()
                .eq('user_id', user?.id);

              if (deleteError) throw deleteError;

              Alert.alert('Sucesso', 'Seus dados foram excluídos com sucesso.');
            } catch (err) {
              setError('Erro ao excluir dados.');
              console.error(err);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
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
      <Header title="Configurações de Privacidade" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Visibilidade do Perfil" showBackButton={false} />
          <Button
            title={`Perfil ${settings.profile_visibility === 'public' ? 'Público' : 'Privado'}`}
            onPress={() =>
              handleUpdateSettings({
                ...settings,
                profile_visibility:
                  settings.profile_visibility === 'public' ? 'private' : 'public',
              })
            }
            variant={settings.profile_visibility === 'public' ? 'contained' : 'outline'}
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Compartilhamento de Dados" showBackButton={false} />
          <Button
            title={`Compartilhar Atividades: ${settings.share_activity ? 'Ativado' : 'Desativado'}`}
            onPress={() =>
              handleUpdateSettings({
                ...settings,
                share_activity: !settings.share_activity,
              })
            }
            variant={settings.share_activity ? 'contained' : 'outline'}
            style={styles.button}
          />
          <Button
            title={`Compartilhar Localização: ${settings.share_location ? 'Ativado' : 'Desativado'}`}
            onPress={() =>
              handleUpdateSettings({
                ...settings,
                share_location: !settings.share_location,
              })
            }
            variant={settings.share_location ? 'contained' : 'outline'}
            style={styles.button}
          />
          <Button
            title={`Compartilhar Avaliações: ${settings.share_ratings ? 'Ativado' : 'Desativado'}`}
            onPress={() =>
              handleUpdateSettings({
                ...settings,
                share_ratings: !settings.share_ratings,
              })
            }
            variant={settings.share_ratings ? 'contained' : 'outline'}
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Dados" showBackButton={false} />
          <Button
            title="Excluir Todos os Dados"
            onPress={handleDeleteData}
            variant="outline"
            style={[styles.button, styles.deleteButton]}
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
  deleteButton: {
    borderColor: '#ff4444',
  },
}); 