import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
  };

  const handlePrivacySettings = () => {
    navigation.navigate('PrivacySettings');
  };

  const handleThemeSettings = () => {
    navigation.navigate('ThemeSettings');
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  const handleDeleteAccount = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);

      if (deleteError) throw deleteError;

      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao excluir conta.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Processando..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Preferências" showBackButton={false} />
          <Button
            title="Notificações"
            onPress={handleNotificationSettings}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Privacidade"
            onPress={handlePrivacySettings}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Tema"
            onPress={handleThemeSettings}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Suporte" showBackButton={false} />
          <Button
            title="Ajuda e Suporte"
            onPress={handleSupport}
            variant="outline"
            style={styles.button}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
          </View>
        )}

        <View style={styles.section}>
          <Header title="Conta" showBackButton={false} />
          <Button
            title="Excluir Conta"
            onPress={handleDeleteAccount}
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
  errorContainer: {
    padding: 16,
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
}); 